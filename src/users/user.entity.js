const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const bestResultsSchema = new Schema({
  easy: { type: Number },
  medium: { type: Number },
  hard: { type: Number },
});

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    totalPlayCount: {
      type: Number,
      required: true,
      default: 0,
    },

    winCount: {
      type: Number,
      required: true,
      default: 0,
    },
    bestResults: bestResultsSchema,
  },
  { collection: 'users' }
);

// eslint-disable-next-line func-names
schema.pre('save', function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
  }

  next();
});

module.exports = mongoose.model('User', schema);
