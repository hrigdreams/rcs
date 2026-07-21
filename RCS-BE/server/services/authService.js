const { User } = require('../models');

class AuthService {
  async register(userData) {
    const { username, email, password, role } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ 
      where: { username } 
    });

    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}

module.exports = new AuthService();