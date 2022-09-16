const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const loginPage = (req, res) => {
  if (req.session?.isLoggedIn) {
    res.redirect('/logout');
  } else {
    res.render('auth/login', {
      title: 'Login',
    });
  }
};

const logoutPage = (req, res) => {
  if (req.session?.isLoggedIn) {
    res.render('auth/logout', {
      title: 'Logout',
      email: req.session?.user?.email,
    });
  } else {
    res.redirect('/login');
  }
};

const registerPage = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
  });
};

// Verify account via Token
const verifyAccount = (req, res) => {
  const { token } = req.query;
  User.findOne({ verificationToken: token })
    .then((user) => {
      if (!user) {
        return res.redirect(
          '/' + `?message=${encodeURIComponent('Account already verified or not found!')}&type=warning`
        );
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.save().then((user) => {
        if (req?.session?.isLoggedIn) {
          req.session.user = user;
          return res.redirect('/' + `?message=${encodeURIComponent('Account verified successfully!')}&type=success`);
        } else {
          return res.redirect(
            '/login' + `?message=${encodeURIComponent('Account verified successfully!')}&type=success`
          );
        }
      });
    })
    .catch((error) => {
      return res.redirect('/' + `?message=${encodeURIComponent('Something went wrong!')}&type=error`);
    });
};

// Register User
const registerUser = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Create User in db if not exists\
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.render('auth/register', {
          title: 'Register',
          message: { type: 'error', text: 'User already exists' },
        });
      } else {
        if (password === confirmPassword) {
          bcrypt.hash(password, 12, (err, hash) => {
            if (err) {
              res.render('auth/register', {
                title: 'Register',
                message: { type: 'error', text: 'Error while registering user' },
              });
            } else {
              const newUser = new User({
                email: email,
                password: hash,
                verificationToken: Math.random().toString(36).substring(2),
              });
              newUser
                .save()
                .then((user) => {
                  const host = req.get('host');
                  const protocol = req.protocol;
                  const link = `${protocol}://${host}/verify?token=${user.verificationToken}`;
                  // TODO: Send verification email

                  res.render('auth/login', {
                    title: 'Register',
                    message: { type: 'success', text: 'User registered successfully' },
                  });
                })
                .catch((err) => {
                  res.render('auth/register', {
                    title: 'Register',
                    message: { type: 'error', text: 'Error while registering user' },
                  });
                });
            }
          });
        } else {
          res.render('auth/register', {
            title: 'Register',
            message: { type: 'error', text: 'Passwords do not match' },
          });
        }
      }
    })
    .catch((err) => {
      res.render('auth/register', {
        title: 'Register',
        message: { type: 'error', text: 'Error while registering user' },
      });
    });
};

// JWT sign
const signUser = (req, res, next) => {
  // Check db for user
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render('auth/login', {
          title: 'Login',
          message: { type: 'error', text: 'User does not exist' },
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.token = jwt.sign(
              {
                id: user._id,
                email: user.email,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: '1h',
              }
            );
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
                return res.render('auth/login', {
                  title: 'Login',
                  message: { type: 'error', text: 'Error while signing in' },
                });
              } else {
                res.redirect('/');
              }
            });
          } else {
            return res.render('auth/login', {
              title: 'Login',
              message: { type: 'error', text: 'Password is incorrect' },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.render('auth/login', {
            title: 'Login',
            message: { type: 'error', text: 'Error while signing in' },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.render('auth/login', {
        title: 'Login',
        message: { type: 'error', text: 'Error while signing in' },
      });
    });
};

// JWT verify
const authVerify = (req, res, next) => {
  const token = req.session?.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        delete req.session.token;
        delete req.session.user;
        req.session.isLoggedIn = false;
        req.session.save();
        // req.session.destroy();
        // res.clearCookie('connect.sid');
        return res.redirect('/login');
      }
      next();
    });
  } else {
    if (req?.session?.isLoggedIn) {
      delete req.session.user;
      req.session.isLoggedIn = false;
      req.session.save();
    }
    req.session.touch();
    next();
  }
};

// Logout User
const logoutUser = (req, res) => {
  delete req.session.token;
  delete req.session.user;
  req.session.isLoggedIn = false;
  req.session.save((err) => {
    if (err) {
      console.log(err);
      res.redirect('/login');
    } else {
      res.redirect('/login');
    }
  });
};

module.exports = { loginPage, logoutPage, registerPage, registerUser, signUser, authVerify, logoutUser, verifyAccount };
