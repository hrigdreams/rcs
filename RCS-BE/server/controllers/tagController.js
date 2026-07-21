const tagService = require('../services/tagService');

class TagController {
  async createTag(req, res) {
    try {
      const tag = await tagService.createTag(req.body);
    
      res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        data: tag
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllTags(req, res) {
    try {
      const tags = await tagService.getAllTags();
      
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTagById(req, res) {
    try {
      const tag = await tagService.getTagById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateTag(req, res) {
    try {
      const tag = await tagService.updateTag(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteTag(req, res) {
    try {
      const result = await tagService.deleteTag(req.params.id);
      
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

  async assignTagToRestaurant(req, res) {
    try {
      const { restaurantId, tagId, weight } = req.body;
      
      // Validate required fields
      if (!restaurantId || !tagId) {
        return res.status(400).json({
          success: false,
          message: 'restaurantId and tagId are required'
        });
      }

      const taglist = await tagService.assignTagToRestaurant(restaurantId, tagId, weight);
      
      res.status(201).json({
        success: true,
        message: 'Tag assigned to restaurant successfully',
        data: taglist
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateTagWeight(req, res) {
    try {
      const { restaurantId, tagId, weight } = req.body;
      
      // Validate required fields
      if (!restaurantId || !tagId || weight === undefined) {
        return res.status(400).json({
          success: false,
          message: 'restaurantId, tagId, and weight are required'
        });
      }

      const taglist = await tagService.updateTagWeight(restaurantId, tagId, weight);
      
      res.status(200).json({
        success: true,
        message: 'Tag weight updated successfully',
        data: taglist
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTagWeightForRestaurant(req, res) {
    try {
        const { restaurantId, tagId } = req.params;
        
        const result = await tagService.getTagWeightForRestaurant(restaurantId, tagId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

  // Remove tag from restaurant
  async removeTagFromRestaurant(req, res) {
    try {
      const { restaurantId, tagId } = req.body;
      const result = await tagService.removeTagFromRestaurant(restaurantId, tagId);
      
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

  // Get all tags for a restaurant
  async getRestaurantTags(req, res) {
    try {
      const tags = await tagService.getRestaurantTags(req.params.restaurantId);
      
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all restaurants with a specific tag
  async getRestaurantsByTag(req, res) {
    try {
      const restaurants = await tagService.getRestaurantByTag(req.params.tagId);
      
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
}

module.exports = new TagController();