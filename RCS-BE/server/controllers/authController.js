const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username, email, and password'
        });
      }

      const user = await authService.register({ username, email, password, role });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const user = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();