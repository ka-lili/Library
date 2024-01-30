require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors')
const allRoutes = require('./routes');
const UserModel = require('./models/user.model');
const session = require("express-session");

const app = express();



  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    UserModel.findById(id).then((err, user)=> {
      done(err, user);
    });
  });  
app.use(express.json());
// app.use(cookieParser());

var corsOptions = {
    origin: ['*'],
    method: 'GET ,POST',
    allowedHeaders: 'Content-Type, Authorization',
    AccessControlAllowOrigin: '*'
}
 app.use(cors());

 // Initialize passport
app.use(passport.initialize());
const sessionMiddleware = session({
    secret: "334443431968-up0aqv28180tlq6u2qma4tnjdfiudmu1.apps.googleusercontent.com",
    resave: true,
    saveUninitialized: true,
  });
  
  app.use(sessionMiddleware);
// app.use(passport.session());
app.use(passport.authenticate('session'));
// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: '334443431968-up0aqv28180tlq6u2qma4tnjdfiudmu1.apps.googleusercontent.com',
  clientSecret: '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',
  javascript_origins:'http://localhost:5000',
  callbackURL: 'http://localhost:5000/api/expauth/v1/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Check if the user already exists in your database
  UserModel.findOne({ email: profile.emails[0].value }).then(( user) => {
    
    
    if (user) {
      // User already exists, log them in
      return done(null, user);
    } else {
      // User doesn't exist, create a new user using social media profile data
      const newUser = new UserModel({
        firstName: profile.name.givenName,
        secondName: profile.name.familyName,
        email: profile.emails[0].value,
       
      });

      newUser.save((err, savedUser) => {
        if (err) return done(err);
        return done(null, savedUser);
      });
    }
  }).catch(error =>{
    if (error) return done(error);

  })
  
}));

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(`> listening on port ${process.env.PORT}`);
    })
    .catch(err => console.log("> Couldn't connect to MongoDB..."));
});

app.use('/api/expauth/v1', allRoutes);

