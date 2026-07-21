const { User, Restaurant, Tag, Like, Taglist, Coldstart } = require('../models');

class RecommendationService {
  // Helper function for Cosine Similarity
  cosineSimilarity(vector1, vector2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    const allKeys = new Set([
      ...Object.keys(vector1),
      ...Object.keys(vector2)
    ]);

    for (const key of allKeys) {
      const val1 = vector1[key] || 0;
      const val2 = vector2[key] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // BUILD TAG VECTOR (Restaurant Feature Vector) 
  async getRestaurantTagVector(restaurantId) {
    const tags = await Taglist.findAll({
      where: { restaurant_id: restaurantId }
    });

    const vector = {};
    tags.forEach(tag => {
      vector[`tag_${tag.tag_id}`] = tag.weight;
    });

    return vector;
  }

  // BUILD USER LIKE VECTOR (User Behavior Vector) 
  async getUserLikeVector(userId) {
    const likes = await Like.findAll({
      where: { user_id: userId }
    });

    const vector = {};
    likes.forEach(like => {
      vector[`restaurant_${like.restaurant_id}`] = 1;
    });

    return vector;
  }

  // RANDOM RESTAURANTS (Fallback for new users) 
  async getRandomRestaurants(k = 5) {
    const allRestaurants = await Restaurant.findAll();
    
    if (allRestaurants.length === 0) {
      throw new Error('No restaurants available');
    }

    // Shuffle and return K random restaurants
    const shuffled = allRestaurants
      .sort(() => Math.random() - 0.5)
      .slice(0, k);

    return shuffled.map(r => ({
      ...r.dataValues,
      similarity_score: 0  // No similarity for random
    }));
  }

  // CONTENT-BASED: Similar Restaurants
  async getContentBasedRecommendations(userId, k = 5) {
    // Step 1: Get restaurants the user has liked
    const userLikes = await Like.findAll({
      where: { user_id: userId }
    });

    //Fallback for new users with no interaction history
    if (userLikes.length === 0) {
      // Step 2: Check cold start tags first
      const coldstartTags = await Coldstart.findAll({
        where: { user_id: userId }
      });

      // If user has chosen tags, use them for recommendations
      if (coldstartTags.length > 0) {
        const tagIds = coldstartTags.map(item => item.tag_id);

        // Step 3: Get restaurants connected to selected tags
        const matchedTagRestaurants = await Taglist.findAll({
          where: { tag_id: tagIds }
        });

        const scoreMap = {};

        matchedTagRestaurants.forEach(item => {
          scoreMap[item.restaurant_id] =
            (scoreMap[item.restaurant_id] || 0) + item.weight;
        });

        const restaurantIds = Object.keys(scoreMap).map(id => parseInt(id, 10));

        // Step 4: Get restaurant details and sort by score
        if (restaurantIds.length > 0) {
          const restaurants = await Restaurant.findAll({
            where: { restaurant_id: restaurantIds }
          });

          return restaurants
            .map(restaurant => ({
              ...restaurant.dataValues,
              similarity_score: scoreMap[restaurant.restaurant_id] || 0
            }))
            .sort((a, b) => b.similarity_score - a.similarity_score)
            .slice(0, k);
        }
      }

      // Fallback for users with no cold start data
      return await this.getRandomRestaurants(k);
    }

    const likedRestaurantIds = userLikes.map(l => l.restaurant_id);

    //2: Get tag vectors for each liked restaurant
    const likedVectors = await Promise.all(
      likedRestaurantIds.map(id => this.getRestaurantTagVector(id))
    );

    // Step 3: Get all restaurants not liked by user
    const allRestaurants = await Restaurant.findAll();
    const candidates = allRestaurants.filter(
      r => !likedRestaurantIds.includes(r.restaurant_id)
    );

    if (candidates.length === 0) {
      return [];
    }

    //4: Calculate similarity for each candidate
    const scoredRestaurants = await Promise.all(
      candidates.map(async (restaurant) => {
        const vector = await this.getRestaurantTagVector(restaurant.restaurant_id); //get candidate vector

        // Average similarity to all liked restaurants
        const similarities = likedVectors.map(v => //map loops through each item in liked vectors using v
          this.cosineSimilarity(v, vector)
        );
        const avgScore = similarities.reduce((a, b) => a + b, 0) / similarities.length;

        return {
          ...restaurant.dataValues,
          similarity_score: avgScore
        };
      })
    );

    //5: Sort and return top K
    return scoredRestaurants
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, k);
  }

  // COLLABORATIVE: Similar Users
  async getCollaborativeRecommendations(userId, k = 5) {
    // 1: Get current user's like vector
    const userVector = await this.getUserLikeVector(userId);

    // Fallback for new users with no interaction history
    if (Object.keys(userVector).length === 0) {
      return await this.getRandomRestaurants(k);
    }

    // 2: Get all other users
    const allUsers = await User.findAll();
    const otherUsers = allUsers.filter(u => u.user_id !== userId);

    if (otherUsers.length === 0) {
      return [];
    }

    //3: Calculate similarity to each user
    const userSimilarities = await Promise.all(
      otherUsers.map(async (otherUser) => {
        const otherVector = await this.getUserLikeVector(otherUser.user_id);
        const similarity = this.cosineSimilarity(userVector, otherVector);

        return {
          user_id: otherUser.user_id,
          similarity
        };
      })
    );

    // 4: Get K nearest neighbors
    const nearestNeighbors = userSimilarities
      .filter(u => u.similarity > 0) // Only similar users
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k); // gets k element

    if (nearestNeighbors.length === 0) {
      return [];
    }

    // 5: Get restaurants liked by neighbors
    const userLikedIds = Object.keys(userVector)
      .map(key => parseInt(key.replace('restaurant_', '')));// restaurant_1 to 1 replace

    const   recommendationScores = {};

    for (const neighbor of nearestNeighbors) {
      const neighborLikes = await Like.findAll({
        where: { user_id: neighbor.user_id }
      });

      neighborLikes.forEach(like => {
        if (!userLikedIds.includes(like.restaurant_id)) {
          recommendationScores[like.restaurant_id] =
            (recommendationScores[like.restaurant_id] || 0) + neighbor.similarity;
        }
      });
    }

    // 6: Get restaurant details and score them
    const recommendedIds = Object.keys(recommendationScores)
      .map(id => parseInt(id));

    const restaurants = await Restaurant.findAll({
      where: { restaurant_id: recommendedIds }
    });

    const result = restaurants.map(r => ({
      ...r.dataValues,
      similarity_score: recommendationScores[r.restaurant_id]
    }));

    return result
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, k);
  }
}

module.exports = new RecommendationService();