const Product = require('../models/Product.js');

const indexPage = (req, res) => {
  res.render('home/index');
};

const categoriesPage = (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      const categories = products.map((product) => product.category);
      const uniqueCategories = [...new Set(categories)];
      const categoriesWithImage = uniqueCategories.map((category) => {
        const image = products.find((product) => product.category === category).images[2];
        return {
          title: category[0].toUpperCase() + category.slice(1),
          image: image,
        };
      });
      if (!products || products.length === 0) {
        res.redirect('/');
      } else {
        res.render('home/categories', { categories: categoriesWithImage });
      }
    }
  });
};

const productsPage = (req, res) => {
  const category = req.params.category;
  Product.find({ category: category }, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      if (!products || products.length === 0) {
        res.redirect('/');
      } else {
        res.render('home/products', { products: products, category: category[0].toUpperCase() + category.slice(1) });
      }
    }
  });
};

const productPage = (req, res) => {
  const id = req.params.id;
  Product.findOne({ id: Number(id) }, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      if (!product || product.length === 0) {
        res.redirect('/');
      } else {
        res.render('home/product', { product: product });
      }
    }
  });
};

const salesPage = (req, res) => {
  res.render('home/sales');
};

module.exports = {
  indexPage,
  categoriesPage,
  productsPage,
  productPage,
  salesPage,
};
