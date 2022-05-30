const express = require('express');
const router = express.Router();
const { allProductsPage, modifyProductPage, addProduct, editProduct, deleteProduct } = require('../controllers/admin');

router.get('/all-products', allProductsPage);
router.get('/modify-product', modifyProductPage);
router.get('/modify-product/:id', modifyProductPage);

router.post('/add-product', addProduct);
router.post('/edit-product', editProduct);
router.post('/delete-product', deleteProduct);

module.exports = router;
