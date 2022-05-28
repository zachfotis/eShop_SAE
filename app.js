// Imports
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
app.use('/', homeRoute);

// Start Server
app.listen(PORT, console.log(`Listening on port ${PORT}`));
