const express = require('express');
const likeController = require('../controllers/likeController');

const router = express.Router();

// Like operations 
router.post('/add', likeController.addLike.bind(likeController));
router.post('/remove', likeController.removeLike.bind(likeController));

// Get likes
router.get('/user/:userId', likeController.getUserLikes.bind(likeController));
router.get('/restaurant/:restaurantId', likeController.getRestaurantLikes.bind(likeController));
router.get('/check', likeController.checkIfLiked.bind(likeController));

module.exports = router;