const favouriteService = require('../services/favouriteService');

class FavouriteController {
  async addFavourite(req, res) {
    try {
      const { userId, restaurantId } = req.body;
      const favourite = await favouriteService.addFavourite(userId, restaurantId);
      
      res.status(201).json({
        success: true,
        message: 'Added to favourites successfully',
        data: favourite
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async removeFavourite(req, res) {
    try {
      const { userId, restaurantId } = req.body;
      const result = await favouriteService.removeFavourite(userId, restaurantId);
      
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

  async getUserFavourites(req, res) {
    try {
      const restaurants = await favouriteService.getUserFavourites(req.params.userId);
      
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

  async checkIfFavourite(req, res) {
    try {
      const { userId, restaurantId } = req.query;
      const result = await favouriteService.checkIfFavourite(userId, restaurantId);
      
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

  async getFavouriteCount(req, res) {
    try {
      const result = await favouriteService.getFavouriteCount(req.params.restaurantId);
      
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

module.exports = new FavouriteController();