const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  id: Number,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
});

const Model = mongoose.model('Products', schema);

module.exports = Model;
