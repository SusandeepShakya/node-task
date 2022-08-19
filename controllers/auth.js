const User = require("../models/user");
const jwt = require('jsonwebtoken'); //Used to generate signed token
const expressJwt = require('express-jwt'); //Authentication Check
const { errorHandler } = require("../helper/dbErrorHandler");

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
        user.hashed_password = undefined

        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    //Find the user based on E-mail
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email not registered. Please Register"
            });
        }
        // If user is found make sure email and password matches the database
        // Create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password doesn't match"
            })
        }

        // Generate a signed token with user ID and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        // Persist the token as 't' in cookie with expiry dates
        res.cookie('t', token, { expire: new Date() + 9999 })
        // Return response with user and token to frontend client
        const { _id, name, email, role } = user
        return res.json({ token, user: { _id, name, email, role } });
    })

};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Sign Out Successfull" });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({
            error: "Access Resource ! Access Denied"
        });
    }
    next();
}