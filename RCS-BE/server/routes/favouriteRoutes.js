const express = require('express');
const favouriteController = require('../controllers/favouriteController');

const router = express.Router();

// Favourite operations
router.post('/add', favouriteController.addFavourite.bind(favouriteController));
router.post('/remove', favouriteController.removeFavourite.bind(favouriteController));

// Get favourites
router.get('/user/:userId', favouriteController.getUserFavourites.bind(favouriteController));
router.get('/check', favouriteController.checkIfFavourite.bind(favouriteController));
router.get('/count/:restaurantId', favouriteController.getFavouriteCount.bind(favouriteController));

module.exports = router;