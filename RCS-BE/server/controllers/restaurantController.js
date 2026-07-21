const restaurantService = require('../services/restaurantService');

class RestaurantController {
  // Create Restaurant (Admin only)
  async createRestaurant(req, res) {
    try {
      const restaurant = await restaurantService.createRestaurant(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Restaurant created successfully',
        data: restaurant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all restaurants (User & Admin)
  async getAllRestaurants(req, res) {
    try {
      const restaurants = await restaurantService.getAllRestaurants();
      
      res.status(200).json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get restaurant by ID (User & Admin)
  async getRestaurantById(req, res) {
    try {
      const restaurant = await restaurantService.getRestaurantById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update restaurant
  async updateRestaurant(req, res) {
    try {
      const restaurant = await restaurantService.updateRestaurant(
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: 'Restaurant updated successfully',
        data: restaurant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete restaurant
  async deleteRestaurant(req, res) {
    try {
      const result = await restaurantService.deleteRestaurant(req.params.id);
      
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
}

module.exports = new RestaurantController();