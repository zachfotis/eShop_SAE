const express = require('express');
const router = express.Router();
const {
  loginPage,
  registerPage,
  logoutPage,
  signUser,
  registerUser,
  logoutUser,
  verifyAccount,
} = require('../controllers/auth');

router.get('/login', loginPage);
router.post('/login', signUser);

router.get('/logout', logoutPage);
router.post('/logout', logoutUser);

router.get('/register', registerPage);
router.post('/register', registerUser);

router.get('/verify', verifyAccount);

module.exports = router;
