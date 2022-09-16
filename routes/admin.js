const express = require('express');
const router = express.Router();
const {
  allProductsPage,
  modifyProductPage,
  addProduct,
  editProduct,
  deleteProduct,
  allOrdersPage,
  changeOrderStatus,
  allUsersPage,
  deleteUser,
} = require('../controllers/admin');

const protectedRoute = (req, res, next) => {
  if (req.session?.user?.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/all-products', protectedRoute, allProductsPage);
router.get('/modify-product', protectedRoute, modifyProductPage);
router.get('/modify-product/:id', protectedRoute, modifyProductPage);
router.get('/delete-product/:id', protectedRoute, deleteProduct);
router.get('/all-orders', protectedRoute, allOrdersPage);
router.get('/all-users', protectedRoute, allUsersPage);

router.post('/add-product', protectedRoute, addProduct);
router.post('/edit-product', protectedRoute, editProduct);
router.post('/delete-product', protectedRoute, deleteProduct);
router.post('/change-order-status', protectedRoute, changeOrderStatus);
router.post('/delete-user', protectedRoute, deleteUser);

module.exports = router;
