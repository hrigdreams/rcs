const { Restaurant } = require('../models');

class RestaurantService {
  async createRestaurant(restaurantData) {
    const { r_name,r_desc, r_location,phone  } = restaurantData;
    // add restaurant
    const restaurant = await Restaurant.create(restaurantData);
    return restaurant;
  }

  async getAllRestaurants() {
    const restaurants = await Restaurant.findAll();
    return restaurants;
  }

  async getRestaurantById(restaurantId) {
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant;
  }

  async updateRestaurant(restaurantId, updateData) {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    // Update restaurant
    await restaurant.update(updateData);
    return restaurant;
  }
  async deleteRestaurant(restaurantId) {
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    await restaurant.destroy();
    return { message: 'Restaurant deleted successfully' };
  }
}

module.exports = new RestaurantService();