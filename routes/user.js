const express = require('express');
const router = express.Router();
const { profilePage, updateShipping } = require('../controllers/user');

const checkLogin = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/profile', checkLogin, profilePage);
router.post('/profile/updateShipping', checkLogin, updateShipping);

module.exports = router;
