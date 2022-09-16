const Product = require('../models/Product.js');
const Order = require('../models/Order.js');
const Payment = require('../models/Payment.js');
const Utilities = require('../models/Utilities');
const User = require('../models/User.js');
const quotes = require('../data/quotes.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendEmail } = require('./mail');

const indexPage = (req, res) => {
  // get random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  !randomQuote?.author && (randomQuote.author = 'Anonymous');

  Product.find({})
    .limit(4)
    .exec((err, books) => {
      if (err) {
        console.log(err);
        return res.render('home/index', {
          title: 'home',
          quote: randomQuote,
        });
      }
      return res.render('home/index', {
        title: 'home',
        quote: randomQuote,
        books: books,
      });
    });
};

const searchQuery = (req, res) => {
  const query = req.query.terms;

  Product.find({ title: { $regex: new RegExp(query, 'i') } })
    .limit(5)
    .exec((err, products) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Error searching for products',
        });
      }
      return res.status(200).json({
        status: 'success',
        products,
      });
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
  if (req.session?.cart && req.session.cart.length > 0) {
    const cart = req.session.cart;
    const firstProduct = cart[0].product.category;
    Product.find({ category: firstProduct })
      .limit(4)
      .exec((err, books) => {
        if (err) {
          console.log(err);
          return res.render('home/cart', {
            title: 'cart',
          });
        }
        if (books.length > 0) {
          return res.render('home/cart', {
            title: 'cart',
            books: books,
          });
        } else {
          return res.render('home/cart', {
            title: 'cart',
          });
        }
      });
  } else {
    return res.render('home/cart', {
      title: 'cart',
    });
  }
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

const checkoutPage = async (req, res) => {
  const { email, firstName, lastName, address, city, country, postalCode, phoneNumber } = req.body;
  if (!email || !firstName || !lastName || !address || !city || !country || !postalCode || !phoneNumber) {
    return res.redirect(`/cart?message=${encodeURIComponent('Please fill in all the fields')}&type=error`);
  }

  const protocol = req.protocol;
  const host = req.get('host');
  const domain = protocol + '://' + host;
  const cart = req.session?.cart;

  if (cart && cart.length > 0) {
    const products = [];

    for (let i = 0; i < cart.length; i++) {
      const product = await Product.findOne({ _id: cart[i].id });
      if (product.stock < cart[i].quantity) {
        return res.redirect(`/cart?message=${encodeURIComponent('Not enough stock')}&type=error`);
      }
      products.push({
        quantity: cart[i].quantity,
        productId: product._id,
        name: product.title,
        price: product.price,
        discount: product.discount,
        image: `https://books.google.com/books/publisher/content?id=${product.bookId}&printsec=frontcover&img=1&zoom=4`,
        description: product.description,
      });
    }
    // if no user
    const order = new Order({
      user: req?.session?.user?._id ? req.session.user._id : null,
      products: products,
      total: req.session.cartTotal,
      status: 'awaiting payment',
      shipping: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        country: country,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
      },
    });

    order.save((err, order) => {
      if (err) {
        console.log(err);
        return res.redirect('/cart');
      } else {
        const payment = new Payment({
          order: order._id,
          amount: order.total,
          currency: 'USD',
          status: 'pending',
        });
        payment.save((err, payment) => {
          if (err) {
            console.log(err.raw.message);
            return res.redirect('/cart');
          } else {
            // Create payment data for Stripe
            const paymentId = payment._id;
            const paymentData = {
              line_items: [],
              payment_method_types: ['card'],
              mode: 'payment',
              success_url: domain + '/payment/success/' + paymentId,
              cancel_url: domain + '/payment/cancel/' + paymentId,
            };

            req?.session?.user?.email
              ? (paymentData.customer_email = req.session.user.email)
              : (paymentData.customer_email = email);

            for (let i = 0; i < order.products.length; i++) {
              const productDiscountedPrice = (
                (order.products[i].price - order.products[i].price * order.products[i].discount) *
                100
              ).toFixed(0);
              paymentData.line_items.push({
                quantity: order.products[i].quantity,
                price_data: {
                  currency: payment.currency,
                  unit_amount: Number(productDiscountedPrice),
                  product_data: {
                    name: order.products[i].name,
                    images: [order.products[i].image],
                  },
                },
              });
            }
            // Stripe checkout session
            stripe.checkout.sessions.create(paymentData, (err, session) => {
              if (err) {
                console.log(err.raw.message);
                return res.redirect('/cart');
              } else {
                payment.stripeSessionId = session.id;
                payment.save((err, payment) => {
                  if (err) {
                    return res.redirect('/cart');
                  } else {
                    return res.redirect(session.url);
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect('/cart');
  }
};

const successPayment = (req, res) => {
  const paymentId = req.params.id;
  Payment.findOne({ _id: paymentId }, (err, payment) => {
    if (err) {
      console.log(err);
      return res.redirect('/cart');
    } else {
      if (!payment || payment.length === 0) {
        return res.redirect('/cart');
      } else {
        Order.findOne({ _id: payment.order }, (err, order) => {
          if (err) {
            console.log(err);
            return res.redirect('/cart');
          } else {
            if (!order || order.length === 0) {
              return res.redirect('/cart');
            } else {
              order.status = 'paid';
              order.save((err, order) => {
                if (err) {
                  console.log(err);
                  return res.redirect('/cart');
                } else {
                  payment.status = 'paid';
                  payment.save((err, payment) => {
                    if (err) {
                      console.log(err);
                      return res.redirect('/cart');
                    } else {
                      // delete payment from mongo
                      Payment.deleteOne({ _id: paymentId }, (err) => {
                        if (err) {
                          console.log(err);
                          res.redirect('/cart');
                        } else {
                          // delete cart from session
                          req.session.cart = [];
                          req.session.cartTotal = 0;
                          // reduce stock
                          for (let i = 0; i < order.products.length; i++) {
                            Product.findOne({ _id: order.products[i].productId }, (err, product) => {
                              if (err) {
                                console.log(err);
                              } else {
                                product.stock -= order.products[i].quantity;
                                product.save((err, product) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    if (!req?.session?.user) {
                                      return res.redirect(
                                        `/?message=${encodeURIComponent(
                                          'You have successfully paid for your order'
                                        )}&type=success`
                                      );
                                    } else {
                                      res.redirect(
                                        `/user/orders?message=${encodeURIComponent('Successful Payment')}&type=success`
                                      );
                                    }
                                    sendEmail(
                                      {
                                        email: order.shipping.email,
                                        date: new Date().toLocaleDateString(),
                                        orderID: order._id,
                                        status: 'Processing Items',
                                        total: Number(order.total).toFixed(2),
                                      },
                                      'verifyOrder'
                                    );
                                  }
                                });
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

const cancelPayment = (req, res) => {
  const paymentId = req.params.id;
  Payment.findOne({ _id: paymentId }, (err, payment) => {
    if (err) {
      console.log(err);
      return res.redirect('/cart');
    } else {
      if (!payment || payment.length === 0) {
        return res.redirect('/cart');
      } else {
        Order.findOne({ _id: payment.order }, (err, order) => {
          if (err) {
            console.log(err);
            return res.redirect('/cart');
          } else {
            if (!order || order.length === 0) {
              return res.redirect('/cart');
            } else {
              // delete payment and order
              Payment.deleteOne({ _id: paymentId }, (err) => {
                if (err) {
                  console.log(err);
                  return res.redirect('/cart');
                } else {
                  Order.deleteOne({ _id: order._id }, (err) => {
                    if (err) {
                      console.log(err);
                      return res.redirect('/cart');
                    } else {
                      return res.redirect('/cart');
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

module.exports = {
  indexPage,
  searchQuery,
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
};
