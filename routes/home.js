const express = require('express');
const router = express.Router();
const { indexPage, productsPages, salesPages } = require('../controllers/home');

router.get('/', indexPage);
router.get('/products', productsPages);
router.get('/sales', salesPages);

module.exports = router;
