const { Like, Restaurant, User } = require('../models');

class LikeService {
  async addLike(userId, restaurantId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    const existingLike = await Like.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    if (existingLike) {
      throw new Error('You have already liked this restaurant');
    }

    // Create like
    const like = await Like.create({
      user_id: userId,
      restaurant_id: restaurantId,
      liked_at: new Date()
    });

    return like;
  }

  async removeLike(userId, restaurantId) {
    const like = await Like.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    if (!like) {
      throw new Error('Like not found');
    }

    await like.destroy();
    return { message: 'Like removed successfully' };
  }

  async getUserLikes(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: Restaurant,
        through: { attributes: ['liked_at'] }
      }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.Restaurants;
  }

  async getRestaurantLikes(restaurantId) {
    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: [{
        model: User,
        through: { attributes: ['liked_at'] }
      }]
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant.Users;
  }

  async checkIfLiked(userId, restaurantId) {
    const like = await Like.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    return { isLiked: !!like };
  }
}

module.exports = new LikeService();