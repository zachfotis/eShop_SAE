const indexPage = (req, res) => {
  res.render('home/index');
};

const productsPages = (req, res) => {
  res.render('home/products');
};

const salesPages = (req, res) => {
  res.render('home/sales');
};

module.exports = {
  indexPage,
  productsPages,
  salesPages,
};
