// Imports
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

// Server APP
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

// PORT
const PORT = process.env.PORT || 5000;

// Cerate JWT secret | ON DEMAND
// process.env.JWT_SECRET = require('crypto').randomBytes(64).toString('hex');

// Middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'my secret password',
    store: store,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      expires: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Verify JWT token

const { authVerify } = require('./controllers/auth');
app.use(authVerify);

// Connect Cart to Session
app.use((req, res, next) => {
  if (req.session.cart) {
    res.locals.cart = req.session.cart;
    res.locals.cartTotal = 0;
    res.locals.cart.forEach((product) => {
      res.locals.cartTotal +=
        (product.product.price - product.product.price * product.product.discount) * product.quantity;
    });
    req.session.cartTotal = res.locals.cartTotal;
  }
  next();
});

// Save variables to locals
app.use((req, res, next) => {
  // Get query from URL
  if (req?.query?.message && req?.query?.message.length > 0 && req?.query?.type && req?.query?.type.length > 0) {
    // escape user all special characters
    res.locals.msg = {
      text: req.query.message.replace(/[^a-zA-Z0-9 ]/g, ''),
      type: req.query.type.replace(/[^a-zA-Z0-9 ]/g, ''),
    };
  }
  if (req.session?.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  if (req.session?.isLoggedIn) {
    res.locals.isLoggedIn = req.session.isLoggedIn;
  } else {
    res.locals.isLoggedIn = null;
  }
  next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.disable('view cache');

// Routes
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');

app.use('/', homeRoute);
app.use('/', authRoute);
app.use('/admin/', adminRoute);
app.use('*', (req, res, next) => {
  res.status(404).render('home/404');
});

// Connect to MongoDb and Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    app.listen(PORT, console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.log(err));
