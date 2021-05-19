const { NotFound } = require('http-errors');
const User = require('./user.entity');

class UserService {
  create(payload) {
    const user = new User(payload);
    return user.save();
  }

  findAll(query) {
    const { offset, limit, sort, asc, ...filter } = query;
    const sortObj = {};
    sortObj[sort] = asc === 'true' ? 'asc' : 'desc';

    Object.entries(filter).forEach(([key, value]) => {
      if (value === '') {
        filter[key] = { $ne: null };
      }
      if (value === '!') {
        filter[key] = null;
      }
    });

    return User.find(filter, { password: false })
      .skip(+offset)
      .limit(+limit)
      .sort(sortObj)
      .exec();
  }

  async findOne(id) {
    const user = await User.findById(id, { password: false }).exec();
    if (!user) {
      throw new NotFound(`User with id ${id} not found.`);
    }
    return user;
  }

  async update(id, payload) {
    let dbUser = await this.findOne(id);
    return User.findByIdAndUpdate(id, payload, { new: true });
  }
}

module.exports = new UserService();
