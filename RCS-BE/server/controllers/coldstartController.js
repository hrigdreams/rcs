const coldstartService = require('../services/coldstartService');

class ColdstartController {
  async saveTags(req, res) {
    try {
      const { userId, tagIds } = req.body;

      if (!userId || !Array.isArray(tagIds) || tagIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'userId and tagIds are required'
        });
      }

      const result = await coldstartService.saveUserTags(userId, tagIds);

      res.status(201).json({
        success: true,
        message: 'Cold start tags saved successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTags(req, res) {
    try {
      const { userId } = req.params;

      const tags = await coldstartService.getUserTags(userId);

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
}

module.exports = new ColdstartController();