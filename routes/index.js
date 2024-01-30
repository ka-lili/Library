const authRoute = require('./auth.routes');
const express = require('express');
const allRoutes = express.Router();
const userRouter = require('./user.routes');

allRoutes.use('/auth', authRoute);
allRoutes.use('/users',userRouter)

module.exports = allRoutes;