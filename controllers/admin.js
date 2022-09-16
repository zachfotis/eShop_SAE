const Product = require('../models/Product.js');
const Order = require('../models/Order.js');
const User = require('../models/User.js');
const { sendEmail } = require('./mail');

const allProductsPage = (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  Product.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ title: 'asc' })
    .exec((err, products) => {
      Product.countDocuments().exec((err, count) => {
        if (err) return redirect(`/?message=${encodeURIComponent('An error occurred in Database')}&type=error`);
        res.render('admin/all-products', {
          title: 'all products',
          products,
          current: page,
          pages: Math.ceil(count / perPage),
          count,
          perPage,
        });
      });
    });
};

const modifyProductPage = (req, res) => {
  const id = req.params.id;
  let isEdit = req.query.edit;
  isEdit === 'true' ? (isEdit = true) : (isEdit = false);
  if (id) {
    Product.findOne({ id }, (err, product) => {
      if (err) {
        console.log(err);
      } else {
        if (!product) {
          res.redirect('/');
        } else {
          res.render('admin/modify-product', {
            title: 'modify product',
            product: product,
            isEdit: isEdit,
          });
        }
      }
    });
  } else {
    res.render('admin/modify-product', {
      title: 'modify product',
      isEdit: isEdit,
      ...res.locals.commonInputs,
    });
  }
};

const addProduct = (req, res) => {
  const data = {
    id: Number(req.body.id),
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    discountPercentage: Number(req.body.discountPercentage),
    images: [],
    price: Number(req.body.price),
    rating: Number(req.body.rating),
    stock: Number(req.body.stock),
    thumbnail: req.body.thumbnail,
    title: req.body.title,
  };

  req.body.image0 && data.images.push(req.body.image0);
  req.body.image1 && data.images.push(req.body.image1);
  req.body.image2 && data.images.push(req.body.image2);
  req.body.image3 && data.images.push(req.body.image3);
  req.body.image4 && data.images.push(req.body.image4);

  if (data.id) {
    Product.create(data, (err, product) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/admin/all-products');
    });
  } else {
    res.redirect('/admin/modify-product/');
  }
};

const editProduct = (req, res) => {
  const data = {
    id: Number(req.body.id),
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    discountPercentage: Number(req.body.discountPercentage),
    images: [],
    price: Number(req.body.price),
    rating: Number(req.body.rating),
    stock: Number(req.body.stock),
    thumbnail: req.body.thumbnail,
    title: req.body.title,
  };

  req.body.image0 && data.images.push(req.body.image0);
  req.body.image1 && data.images.push(req.body.image1);
  req.body.image2 && data.images.push(req.body.image2);
  req.body.image3 && data.images.push(req.body.image3);
  req.body.image4 && data.images.push(req.body.image4);

  if (data.id) {
    Product.findOneAndUpdate({ id: data.id }, data, (err, product) => {
      if (err) {
        console.log(err);
      } else {
        if (!product) {
          res.redirect(`/admin/modify-product/${data.id}?edit=true`);
        } else {
          res.redirect('/admin/all-products');
        }
      }
    });
  } else {
    res.redirect('/admin/modify-product/');
  }
};

const deleteProduct = (req, res) => {
  const id = req.body.id;
  if (id) {
    Product.findOneAndDelete({ id: id }, (err, product) => {
      if (err) {
        console.log(err);
      } else {
        if (!product) {
          res.redirect('/admin/all-products');
        } else {
          res.redirect('/admin/all-products');
        }
      }
    });
  } else {
    res.redirect('/admin/all-products');
  }
};

const allOrdersPage = (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  Order.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ date: 'desc' })
    .exec((err, orders) => {
      Order.countDocuments().exec((err, count) => {
        if (err) return redirect(`/?message=${encodeURIComponent('An error occurred in Database')}&type=error`);
        res.render('admin/all-orders', {
          title: 'all orders',
          orders,
          current: page,
          pages: Math.ceil(count / perPage),
          count,
          perPage,
        });
      });
    });
};

const changeOrderStatus = (req, res) => {
  const id = req.body.id;
  const status = req.body.status;
  console.log(id, status);
  if (id) {
    Order.findOneAndUpdate({ _id: id }, { status: status }, (err, order) => {
      if (err) {
        console.log(err);
      } else {
        if (!order) {
          res.json({ status: 'failed', message: 'Order not found' });
        } else {
          sendEmail(
            {
              email: order.shipping.email,
              date: new Date().toLocaleDateString(),
              orderID: order._id,
              status: status.replace(/\b\w/g, (l) => l.toUpperCase()),
              total: Number(order.total).toFixed(2),
            },
            'changeOrderStatus'
          );
          res.json({ status: 'success', message: 'Order status updated' });
        }
      }
    });
  } else {
    res.json({ status: 'error', message: 'An error occurred' });
  }
};

const allUsersPage = (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  User.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ date: 'desc' })
    .exec((err, users) => {
      User.countDocuments().exec((err, count) => {
        if (err) return redirect(`/?message=${encodeURIComponent('An error occurred in Database')}&type=error`);
        res.render('admin/all-users', {
          title: 'all users',
          users,
          current: page,
          pages: Math.ceil(count / perPage),
          count,
          perPage,
        });
      });
    });
};

const deleteUser = (req, res) => {
  const id = req.body.id;
  if (id) {
    User.findOneAndDelete({ _id: id }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (!user) {
          res.json({ status: 'failed', message: 'User not found' });
        } else {
          res.json({ status: 'success', message: 'User deleted' });
        }
      }
    });
  } else {
    res.json({ status: 'error', message: 'An error occurred' });
  }
};

module.exports = {
  allProductsPage,
  modifyProductPage,
  allOrdersPage,
  addProduct,
  editProduct,
  deleteProduct,
  changeOrderStatus,
  allUsersPage,
  deleteUser,
};
