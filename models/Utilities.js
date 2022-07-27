const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  categories: {
    type: [
      {
        category: String,
        image: String,
      },
    ],
  },
});

const Model = mongoose.model('Utilities', schema);

module.exports = Model;
