// Imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Server APP
const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.disable('view cache');

// Routes
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
app.use('/', homeRoute);
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
