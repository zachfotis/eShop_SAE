// Imports
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');
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
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  const commonInputs = {};
  if (req.session?.user) {
    commonInputs.user = req.session.user;
  } else {
    commonInputs.user = null;
  }
  if (req.session?.isLoggedIn) {
    commonInputs.isLoggedIn = req.session.isLoggedIn;
  } else {
    commonInputs.isLoggedIn = false;
  }
  res.locals.commonInputs = commonInputs;
  next();
});

const { authVerify } = require('./controllers/auth');
app.use(authVerify);

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
