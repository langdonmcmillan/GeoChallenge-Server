const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const keys = require("../config/keys");
const User = require("../models/user");

exports.signup = (req, res, next) => {
    const { email, password, userName } = req.body;

    if (!email || !password)
        return res.status(400).send({ message: "Email and password required" });

    User.findOne({ email: email }, (error, existingUser) => {
        if (error) return next(error);

        if (existingUser)
            return res.status(400).send({ message: "Email already in use" });

        const user = new User({
            email: email,
            password: password,
            userName: userName
        });
        user.save(error => {
            if (error) return next(error);
            res.json({ token: generateToken(user.id) });
        });
    });
};

exports.login = (req, res, next) => {
    const { user } = req;
    res.send({ token: generateToken(user.id) });
};

const generateToken = user => {
    return jwt.sign({ data: user }, keys.secret, {
        expiresIn: "30 days"
    });
};
