const express = require('express');
const router = express.Router();
const { indexPage, categoriesPage, productsPage, productPage, salesPage, cartPage } = require('../controllers/home');

router.get('/', indexPage);
router.get('/categories', categoriesPage);
router.get('/categories/:category', productsPage);
router.get('/products/:id', productPage);
router.get('/sales', salesPage);
router.get('/cart', cartPage);

module.exports = router;
