const express = require('express');
const router = express.Router();
const { loginPage, registerPage, logoutPage, signUser, registerUser, logoutUser } = require('../controllers/auth');

router.get('/login', loginPage);
router.post('/login', signUser);

router.get('/logout', logoutPage);
router.post('/logout', logoutUser);

router.get('/register', registerPage);
router.post('/register', registerUser);

module.exports = router;
