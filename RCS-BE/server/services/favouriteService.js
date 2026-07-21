const { Favourite, Restaurant, User } = require('../models');

class FavouriteService {
  async addFavourite(userId, restaurantId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const existingFavourite = await Favourite.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    if (existingFavourite) {
      throw new Error('Restaurant is already in your favourites');
    }

    // Create favourite
    const favourite = await Favourite.create({
      user_id: userId,
      restaurant_id: restaurantId,
      created_at: new Date()
    });

    return favourite;
  }

  async removeFavourite(userId, restaurantId) {
    const favourite = await Favourite.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    if (!favourite) {
      throw new Error('Favourite not found');
    }

    await favourite.destroy();
    return { message: 'Removed from favourites successfully' };
  }

  async getUserFavourites(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: Restaurant,
        through: {
          model: Favourite, 
          attributes: ['created_at'] }
      }]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.Restaurants;
  }

  async checkIfFavourite(userId, restaurantId) {
    const favourite = await Favourite.findOne({
      where: { user_id: userId, restaurant_id: restaurantId }
    });

    return { isFavourite: !!favourite };
  }

  async getFavouriteCount(restaurantId) {
    const count = await Favourite.count({
      where: { restaurant_id: restaurantId }
    });

    return { count };
  }
}

module.exports = new FavouriteService();