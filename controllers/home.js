const Product = require('../models/Product.js');
const Utilities = require('../models/Utilities');
const User = require('../models/User.js');
const quotes = require('../data/quotes.js');

const indexPage = (req, res) => {
  // get random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  !randomQuote?.author && (randomQuote.author = 'Anonymous');

  res.render('home/index', {
    title: 'home',
    quote: randomQuote,
  });
};

const categoriesPage = (req, res) => {
  Utilities.findOne({}, (err, utilities) => {
    if (err) {
      console.log(err);
    } else {
      res.render('home/categories', {
        title: 'categories',
        categories: utilities.categories,
      });
    }
  });
};

const productsPage = (req, res) => {
  const category = req.params.category;
  Product.find({ category: { $regex: new RegExp(category, 'i') } }, null, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      if (!products || products.length === 0) {
        res.redirect('/');
      } else {
        res.render('home/products', {
          title: 'products',
          products: products,
        });
      }
    }
  });
};

const productPage = (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id }, (err, product) => {
    if (err) {
      return res.redirect('/');
    } else {
      if (!product || product.length === 0) {
        res.redirect('/');
      } else {
        // Check if product is in wishlist
        if (req?.session?.user?.wishlist.find((item) => item.id.valueOf() === product._id.valueOf())) {
          product.isInWishlist = true;
        } else {
          product.isInWishlist = false;
        }

        res.render('home/product', {
          title: 'product',
          product: product,
        });
      }
    }
  });
};

const salesPage = (req, res) => {
  Product.find({ discount: { $gte: 0.1 } }, (err, products) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      if (!products || products.length === 0) {
        res.redirect('/'); // TODO: render with error message
      } else {
        const productsByCategory = {};
        products.forEach((product) => {
          if (!productsByCategory[product.category]) {
            productsByCategory[product.category] = [];
          }
          productsByCategory[product.category].push(product);
        });

        res.render('home/sales', {
          title: 'sales',
          products: productsByCategory,
        });
      }
    }
  });
};

const cartPage = (req, res) => {
  res.render('home/cart', {
    title: 'cart',
  });
};

const addToCart = (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id }, (err, product) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      if (!product || product.length === 0) {
        res.redirect('/');
      } else {
        if (!req.session?.cart) {
          req.session.cart = [];
        }
        // if product is not in cart, add it
        if (!req.session.cart.find((item) => item.id === id)) {
          req.session.cart.push({
            id: id,
            product: product,
            quantity: 1,
          });
        } else {
          // if product is in cart, increase quantity
          const item = req.session.cart.find((item) => item.id === id);
          item.quantity += 1;
        }
        req.session.save((err) => {
          if (err) {
            res.redirect('/');
          } else {
            res.redirect('/cart');
          }
        });
      }
    }
  });
};

const removeFromCart = (req, res) => {
  const id = req.params.id;
  if (req.session?.cart) {
    const item = req.session.cart.find((item) => item.id === id);
    if (item) {
      req.session.cart.splice(req.session.cart.indexOf(item), 1);
    }
  }
  res.redirect('/cart');
};

const decreaseFromCart = (req, res) => {
  const id = req.params.id;
  if (req.session?.cart) {
    const item = req.session.cart.find((item) => item.id === id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity === 0) {
        req.session.cart.splice(req.session.cart.indexOf(item), 1);
      }
    }
  }
  res.redirect('/cart');
};

const addToWishList = (req, res) => {
  const productId = req.params.id;
  if (req?.session?.user) {
    User.findOne({ _id: req.session.user._id }, (err, user) => {
      if (err) {
        // Error during finding the user
        return res.redirect('/');
      } else {
        if (!user || user.length === 0) {
          // User not found
          return res.redirect('/');
        } else {
          // User found
          user.toggleFromWishlist(productId, (isRemoved) => {
            if (isRemoved) {
              // Product removed from wishlist
              // Update session
              req.session.user = user;
              req.session.save();
              return res.redirect(
                '/products/' +
                  productId +
                  `?message=${encodeURIComponent('Product removed from wishlist')}&type=warning`
              );
            } else {
              // Product added to wishlist
              // Update session
              req.session.user = user;
              req.session.save();
              return res.redirect(
                '/products/' + productId + `?message=${encodeURIComponent('Product added to wishlist')}&type=success`
              );
            }
          });
        }
      }
    });
  } else {
    // User not logged in
    return res.redirect(
      '/products/' +
        productId +
        `?message=${encodeURIComponent('You must log in to add products to your wishlist')}&type=error`
    );
  }
};

module.exports = {
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
};
