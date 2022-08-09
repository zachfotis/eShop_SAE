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
      _id: false,
    },
  ],
});

// Add to wishlist
schema.methods.toggleFromWishlist = function (productId, isRemovedCallback) {
  let isRemoved = null;
  if (!this.wishlist) {
    this.wishlist = [];
  }
  if (!this.wishlist.find((item) => item.id.valueOf() === productId)) {
    // Add to wishlist
    this.wishlist.push({ id: mongoose.Types.ObjectId(productId) });
    this.save();
    return isRemovedCallback(isRemoved);
  } else {
    // Remove from wishlist
    this.wishlist = this.wishlist.filter((item) => item.id.valueOf() !== productId);
    this.save();
    isRemoved = true;
    return isRemovedCallback(isRemoved);
  }
};

module.exports = mongoose.model('Users', schema);
