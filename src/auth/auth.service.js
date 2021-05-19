const { Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../users/user.entity');

class AuthService {
  async validate(username, password) {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Unauthorized('Invalid username or password');
    }
    return user;
  }

  async login(username, password) {
    const user = await this.validate(username, password);

    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  }

  validateToken(token) {
    const obj = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });

    return { userId: obj.userId };
  }
}

module.exports = new AuthService();
