const express = require('express');
const { SignIn, SignUp, ForgotPassword } = require('../controller/auth.controller');
const authRoute = express.Router();
const passport = require('passport');

authRoute.post('/signin', SignIn);
authRoute.post('/signup', SignUp);
authRoute.post('/forgot-password', ForgotPassword);


// Google authentication route
authRoute.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google authentication callback route
authRoute.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signInError' }),
  (req, res) => {
    // Successful authentication, redirect home or respond with user data
    res.redirect('/api/expauth/v1/users/profile');
  }
);


module.exports = authRoute;