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
    Product.findOne({ _id: id }, (err, product) => {
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
    });
  }
};

const addProduct = (req, res) => {
  const data = {
    bookId: req.body.bookId,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    authors: [req.body.authors],
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    isbn: req.body.isbn,
    pageCount: Number(req.body.pageCount),
    price: Number(req.body.price),
    discount: Number(req.body.discount),
    stock: Number(req.body.stock),
    imageLinks: {
      smallThumbnail: req.body.smallThumbnail,
      thumbnail: req.body.thumbnail,
      small: req.body.small,
      medium: req.body.medium,
      large: req.body.large,
      extraLarge: req.body.extraLarge,
    },
  };

  const product = new Product(data);
  product.save((err, product) => {
    if (err) {
      return res.json({ status: 'error', message: 'An error occurred' });
    } else {
      return res.json({ status: 'success', message: 'Product added successfully' });
    }
  });
};

const editProduct = (req, res) => {
  console.log(req.body);
  const data = {
    productId: req.body.productId,
    bookId: req.body.bookId,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    authors: [req.body.authors],
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    isbn: req.body.isbn,
    pageCount: Number(req.body.pageCount),
    price: Number(req.body.price),
    discount: Number(req.body.discount),
    stock: Number(req.body.stock),
    imageLinks: {
      smallThumbnail: req.body.smallThumbnail,
      thumbnail: req.body.thumbnail,
      small: req.body.small,
      medium: req.body.medium,
      large: req.body.large,
      extraLarge: req.body.extraLarge,
    },
  };
  Product.findOneAndUpdate({ _id: data.productId }, data, (err, product) => {
    if (err) {
      return res.json({ status: 'error', message: 'An error occurred' });
    } else {
      return res.json({ status: 'success', message: 'Product updated successfully' });
    }
  });
};

const deleteProduct = (req, res) => {
  const id1 = req.body.productId;
  const id2 = req.params.id;

  if (id1) {
    Product.findOneAndDelete({ _id: id1 }, (err, product) => {
      if (err) {
        return res.json({ status: 'error', message: 'An error occurred' });
      } else {
        return res.json({ status: 'success', message: 'Product deleted successfully' });
      }
    });
  } else if (id2) {
    Product.findOneAndDelete({ _id: id2 }, (err, product) => {
      if (err) {
        return res.redirect(`/?message=${encodeURIComponent('An error occurred in Database')}&type=error`);
      } else {
        return res.redirect(`/?message=${encodeURIComponent('Product deleted successfully')}&type=success`);
      }
    });
  } else {
    return res.redirect(`/?message=${encodeURIComponent('Product not found')}&type=error`);
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
