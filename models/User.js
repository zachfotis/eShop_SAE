const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlist: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
});

// Add to wishlist
schema.methods.addToWishList = function (productId) {
  if (!this.wishlist) {
    this.wishlist = [];
  }
  if (!this.wishlist.find((item) => item.id.toString() === productId.toString())) {
    this.wishlist.push({
      id: productId,
    });
    return this.save();
  }
  return this.save();
};

module.exports = mongoose.model('Users', schema);
