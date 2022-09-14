const express = require('express');
const router = express.Router();
const { profilePage, updateShipping, updateCard, updatePassword, wishlistPage, ordersPage } = require('../controllers/user');

const checkLogin = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// User Profile
router.get('/profile', checkLogin, profilePage);
router.post('/profile/updateShipping', checkLogin, updateShipping);
router.post('/profile/updateCard', checkLogin, updateCard);
router.post('/profile/updatePassword', checkLogin, updatePassword);

// User Wishlist
router.get('/wishlist', checkLogin, wishlistPage);

// User Orders
router.get('/orders', checkLogin, ordersPage);

module.exports = router;
