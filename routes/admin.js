const express = require('express');
const router = express.Router();
const { allProductsPage } = require('../controllers/admin');

router.get('/all-products', allProductsPage);

module.exports = router;
