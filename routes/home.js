const { success } = require('daisyui/src/colors/colorNames');
const express = require('express');
const router = express.Router();
const {
  indexPage,
  categoriesPage,
  productsPage,
  productPage,
  salesPage,
  cartPage,
  addToCart,
  removeFromCart,
  decreaseFromCart,
  addToWishList,
  checkoutPage,
  successPayment,
  cancelPayment,
  searchQuery,
} = require('../controllers/home');

router.get('/', indexPage);
router.get('/search', searchQuery);
router.get('/categories', categoriesPage);
router.get('/categories/:category', productsPage);
router.get('/products/:id', productPage);
router.get('/products/:id/add-to-wishlist', addToWishList);
router.get('/sales', salesPage);
router.get('/cart', cartPage);
router.get('/cart/add/:id', addToCart);
router.get('/cart/remove/:id', removeFromCart);
router.get('/cart/decrease/:id', decreaseFromCart);
router.get('/payment/success/:id', successPayment);
router.get('/payment/cancel/:id', cancelPayment);

router.post('/create-checkout-session', checkoutPage);

module.exports = router;
