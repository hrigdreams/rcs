const { Coldstart, Restaurant, Taglist } = require('../models');

class ColdstartService {
  async saveUserTags(userId, tagIds) {
    if (!userId) {
      throw new Error('userId is required');
    }

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new Error('tagIds must be a non-empty array');
    }

    await Coldstart.destroy({ where: { user_id: userId } });

    const rows = tagIds.map(tagId => ({
      user_id: userId,
      tag_id: tagId
    }));

    return await Coldstart.bulkCreate(rows);
  }

  async getUserTags(userId) {
    return await Coldstart.findAll({ where: { user_id: userId } });
  }

  async getRecommendationsFromTags(userId, k = 5) {
    const userTags = await Coldstart.findAll({ where: { user_id: userId } });

    if (!userTags.length) {
      return [];
    }

    const tagIds = userTags.map(item => item.tag_id);

    const restaurantTags = await Taglist.findAll({
      where: { tag_id: tagIds }
    });

    const scores = {};

    for (const item of restaurantTags) {
      scores[item.restaurant_id] = (scores[item.restaurant_id] || 0) + (item.weight || 1);
    }

    const restaurantIds = Object.keys(scores).map(id => parseInt(id, 10));

    if (!restaurantIds.length) {
      return [];
    }

    const restaurants = await Restaurant.findAll({
      where: { restaurant_id: restaurantIds }
    });

    return restaurants
      .map(restaurant => ({
        ...restaurant.dataValues,
        similarity_score: scores[restaurant.restaurant_id] || 0
      }))
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, k);
  }
}

module.exports = new ColdstartService();