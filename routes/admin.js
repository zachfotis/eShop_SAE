const express = require('express');
const router = express.Router();
const { modifyProductPage } = require('../controllers/modifyProduct');

router.get('/modify-product', modifyProductPage);

module.exports = router;
