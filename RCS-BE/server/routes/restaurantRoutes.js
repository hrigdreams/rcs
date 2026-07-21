const express = require('express');
const restaurantController = require('../controllers/restaurantController');

const router = express.Router();

router.post('/create', restaurantController.createRestaurant.bind(restaurantController));
router.get('/all', restaurantController.getAllRestaurants.bind(restaurantController));
router.get('/:id', restaurantController.getRestaurantById.bind(restaurantController));
router.put('/update/:id', restaurantController.updateRestaurant.bind(restaurantController));
router.delete('/delete/:id', restaurantController.deleteRestaurant.bind(restaurantController));

module.exports = router;