var mongoose = require('mongoose');

const userScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true
  }
});

const User = mongoose.model('User', userScheme);

module.exports = User;