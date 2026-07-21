const recommendationService = require('../services/recommendationService');

class RecommendationController {
  // Content-based recommendations
  async getContentBasedRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { k } = req.query;
      const limit = k ? parseInt(k) : 5;

      const recommendations = await recommendationService
        .getContentBasedRecommendations(userId, limit);

      res.status(200).json({
        success: true,
        method: 'Content-Based (Tag Similarity)',
        count: recommendations.length,
        data: recommendations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Collaborative filtering recommendations
  async getCollaborativeRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { k } = req.query;
      const limit = k ? parseInt(k) : 5;

      const recommendations = await recommendationService
        .getCollaborativeRecommendations(userId, limit);

      res.status(200).json({
        success: true,
        method: 'Collaborative Filtering (User Similarity)',
        count: recommendations.length,
        data: recommendations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Hybrid recommendations
  async getHybridRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { k } = req.query;
      const limit = k ? parseInt(k) : 5;

      const recommendations = await recommendationService
        .getHybridRecommendations(userId, limit);

      res.status(200).json({
        success: true,
        method: 'Hybrid (Content + Collaborative)',
        count: recommendations.length,
        data: recommendations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new RecommendationController();