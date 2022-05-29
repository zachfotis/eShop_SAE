const Product = require('../models/Product.js');

const indexPage = (req, res) => {
  res.render('home/index');
};

const productsPages = (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      // create array with the categories of products
      const categories = products.map((product) => product.category);
      // create array with the unique categories
      const uniqueCategories = [...new Set(categories)];
      // add image to each category
      const categoriesWithImage = uniqueCategories.map((category) => {
        const image = products.find((product) => product.category === category).images[0];
        return {
          category,
          image,
        };
      });
      // create array with the products of each category
      const productsByCategory = uniqueCategories.map((category) => {
        return {
          category,
          products: products.filter((product) => product.category === category),
        };
      });
      res.render('home/products', { products });
    }
  });
};

const salesPages = (req, res) => {
  res.render('home/sales');
};

module.exports = {
  indexPage,
  productsPages,
  salesPages,
};
