const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  stripeSessionId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Model = mongoose.model('Payments', schema);

module.exports = Model;
