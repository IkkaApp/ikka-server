var mongoose = require('mongoose');

const productScheme = mongoose.Schema({
  name: String,
  id: String,
  type: String
});

const Product = mongoose.model('Product', productScheme);

module.exports = Product;