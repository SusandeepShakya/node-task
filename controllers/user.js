const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const { errorHandler } = require('../helper/dbErrorHandler');

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined
        user.hashed_password
        res.json({
            user
        });
    });
};

exports.signin = (req.res) => {
    const{email,password} = req.body
    User.findOne({email}, (err,user) => {
        if (err || !user){
            return res.status(400).json({
                err: "User wuth tath email is not registerd. Try signing up"
            });
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    });
} 