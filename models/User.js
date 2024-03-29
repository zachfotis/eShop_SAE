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
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  shipping: {
    type: {
      recipient: {
        type: String,
        required: true,
      },
      streetName: {
        type: String,
        required: true,
      },
      streetNumber: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      geoLocation: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    required: false,
  },
  creditCards: [
    {
      cardOwner: {
        type: String,
        required: true,
      },
      cardNumber: {
        type: String,
        required: true,
      },
      cardExpirationDate: {
        type: String,
        required: true,
      },
      cardType: {
        type: String,
        required: true,
      },
    },
  ],
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
    this.save((err) => {
      return isRemovedCallback(isRemoved);
    });
  } else {
    // Remove from wishlist
    this.wishlist = this.wishlist.filter((item) => item.id.valueOf() !== productId);
    this.save();
    isRemoved = true;
    this.save((err) => {
      return isRemovedCallback(isRemoved);
    });
  }
};

module.exports = mongoose.model('Users', schema);
