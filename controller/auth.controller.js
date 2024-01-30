const UserModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorHandler = require('../errors/errorHandler');
const sendEmail = require('../middlewares/sendEmail');
const passport = require('passport');
const express = require('express');


//end of mine////

require('dotenv').config()
const SignUp = async (req, res, next) => {
    const { firstName, secondName, email, password, confirmPassword } = req.body;
    try {
        var userExists = await UserModel.findOne({ email: email });
        console.log(userExists);
        if (userExists) {
            return next(errorHandler(401, "User with this email already exists"));
        } else {
            const hashedPassword = bcryptjs.hashSync(password, 10);
            
            var newUser = new UserModel({
                firstName: firstName,
                secondName: secondName,
                email: email, 
                password: hashedPassword, 
                confirmPassword: hashedPassword,
            });

            var savedUser = await newUser.save();
            res.status(201).json({ message: 'Account created!', savedUser});
            var subject= "Wisdom Library";
            var message = "You have signed Up successfully";
            var a = "kayitesililiane73@gmail.com";
            await sendEmail(a,subject,message);
        }
    } catch (error) {
        // console.log(error.message);
        res.status(500).send(error.message)
        // return next(errorHandler(error));  
    }
};

const SignIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await UserModel.findOne({ email: email});    
        if (!validUser) return next(errorHandler(401, "Invalid username or password"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid username or password"));    

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

        const { password: hashedPassword, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate})
            .status(200)
            .json(rest);

    } catch (error) {
        
        res.status(500).send(error.message);
    }
};

const ForgotPassword = async (req, res, next) => {
    try {
        const validUser = await UserModel.findOne({ email: req.body.email});    
        if (!validUser) return next(errorHandler(401, "Invalid email"));
        
        var token = jwt.sign({ email: req.body }, process.env.JWT_SECRET_KEY, { expiresIn: 1200 });

        var recoveryLink = `http://localhost:3000/reset-password/${token}/${validUser._id}`;
        
        sendEmail(validUser.email, 'Reset Password', recoveryLink);

        res.status(200).json({ message: `Password reset link sent to your email!` });
    } catch (error) {
        // next(errorHandler(error));
        res.status(500).json(error);
    }
}

module.exports = {
    SignIn,
    SignUp,
    ForgotPassword
}