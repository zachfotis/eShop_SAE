const Product = require('../models/Product.js');
const Utilities = require('../models/Utilities');
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
      console.log(err);
    } else {
      if (!product || product.length === 0) {
        res.redirect('/');
      } else {
        res.render('home/product', {
          title: 'product',
          product: product,
        });
      }
    }
  });
};

const salesPage = (req, res) => {
  Product.find({ discount: { $gt: 0.1 } }, (err, products) => {
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

module.exports = {
  indexPage,
  categoriesPage,
  productsPage,
  productPage,
  salesPage,
  cartPage,
};
