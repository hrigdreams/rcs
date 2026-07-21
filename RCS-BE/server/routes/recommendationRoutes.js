const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

// GET /recommendations/user/:userId/content-based?k=5
router.get('/user/:userId/content-based', 
  recommendationController.getContentBasedRecommendations
    .bind(recommendationController)
);

// GET /recommendations/user/:userId/collaborative?k=5
router.get('/user/:userId/collaborative', 
  recommendationController.getCollaborativeRecommendations
    .bind(recommendationController)
);

// GET /recommendations/user/:userId/hybrid?k=5
router.get('/user/:userId/hybrid', 
  recommendationController.getHybridRecommendations
    .bind(recommendationController)
);

module.exports = router;