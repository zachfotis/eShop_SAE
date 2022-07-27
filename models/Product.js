const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  authors: {
    type: Array,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  imageLinks: {
    type: Object,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Array,
    required: false,
  },
  ratings: {
    type: [Number],
    required: false,
  },
});

const Model = mongoose.model('Products', schema);

module.exports = Model;
