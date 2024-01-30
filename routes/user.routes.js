const express = require('express');
const passport = require('passport')
const {getUser} = require('../controller/user.controller');

const userRouter = express.Router();

userRouter.get('/profile',getUser);

module.exports= userRouter;