var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const favoriteBook = req.body.favoriteBook;
  if(email && name && password && confirmPassword && favoriteBook) {
      if(password !== confirmPassword) {
        var err = new Error('Passwords do not match');
        err.status = 400;
        return next (err);
      }
      
      var userData = {email, name, password, favoriteBook};
      User.create(userData, (error, user) => {
        if(error){
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      })

    } else {
      var err = new Error('All fields required');
      err.status = 400;
      return next (err);
    }
});

router.get('/login', function(req, res, next) {
  return res.render('login', { title: 'Log in' });
});

router.get('/logout', function(req, res, next) {
  if(req.session){
    req.session.destroy(function(err) {
      if(err){
        return next(err);
      } else {
        res.redirect('/');
      }
    })
  }
});

router.post('/login', function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  if(email && pass) {
    User.authenticate(email, pass, (error, user) => {
      if(error || !user) {
        var err = new Error('Incorrect email or password');
        err.status = 401;
        return next (err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
});

router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
