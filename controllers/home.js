const axios = require('axios').default;

const indexPage = (req, res) => {
  res.render('home/index');
};

const productsPages = (req, res) => {
  axios.get('https://dummyjson.com/products').then((data) => {
    const products = data.data.products;
    res.render('home/products', { products });
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
