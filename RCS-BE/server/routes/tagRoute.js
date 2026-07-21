const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

// CRUD routes
router.post('/create', tagController.createTag.bind(tagController));
router.get('/all', tagController.getAllTags.bind(tagController));
router.put('/update/:id', tagController.updateTag.bind(tagController));
router.delete('/delete/:id', tagController.deleteTag.bind(tagController));
router.get('/:id', tagController.getTagById.bind(tagController));

// Tag assignment routes (with weight handling)
router.post('/assign', tagController.assignTagToRestaurant.bind(tagController));
router.put('/weight', tagController.updateTagWeight.bind(tagController));
router.post('/remove', tagController.removeTagFromRestaurant.bind(tagController));

// Get tags for a restaurant (with weights)
router.get('/restaurant/:restaurantId', tagController.getRestaurantTags.bind(tagController));

// Get restaurants by tag (with weights)
router.get('/restaurants-by-tag/:tagId', tagController.getRestaurantsByTag.bind(tagController));

// Get weight of specific tag for specific restaurant
router.get('/weight/:restaurantId/:tagId', tagController.getTagWeightForRestaurant.bind(tagController));
module.exports = router;