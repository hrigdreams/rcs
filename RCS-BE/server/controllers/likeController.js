const likeService = require('../services/likeService');

class LikeController {
  // Add like
  async addLike(req, res) {
    try {
      const { userId, restaurantId } = req.body;
      const like = await likeService.addLike(userId, restaurantId);
      
      res.status(201).json({
        success: true,
        message: 'Restaurant liked successfully',
        data: like
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Remove like
  async removeLike(req, res) {
    try {
      const { userId, restaurantId } = req.body;
      const result = await likeService.removeLike(userId, restaurantId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user's liked restaurants
  async getUserLikes(req, res) {
    try {
      const restaurants = await likeService.getUserLikes(req.params.userId);
      
      res.status(200).json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get users who liked a restaurant
  async getRestaurantLikes(req, res) {
    try {
      const users = await likeService.getRestaurantLikes(req.params.restaurantId);
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Check if user liked restaurant
  async checkIfLiked(req, res) {
    try {
      const { userId, restaurantId } = req.query;
      const result = await likeService.checkIfLiked(userId, restaurantId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new LikeController();