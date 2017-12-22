const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const keys = require("../config/keys");
const User = require("../models/user");
const AuthenticationService = require("../services/authentication");

exports.signup = (req, res, next) => {
    const { email, password, userName } = req.body;

    if (!email || !password)
        return res
            .status(400)
            .send({ message: "Email and password required." });
    User.findOne(
        { $or: [{ userName: userName }, { email: email }] },
        (error, existingUser) => {
            if (error) return next(error);

            if (existingUser) {
                const messageItem =
                    existingUser.email === email ? "Email" : "User Name";
                return res
                    .status(400)
                    .send({ message: `${messageItem} already in use.` });
            }

            const user = new User({
                email: email,
                password: password,
                userName: userName
            });
            user.save(error => {
                if (error) return next(error);
                res.json({ token: generateToken(user.id), user });
            });
        }
    );
};

exports.login = async (req, res, next) => {
    const { userName, password } = req.body;
    AuthenticationService.loginUser(userName, password, function(result) {
        if (result.success) {
            result.token = generateToken(result.user.id);
        }
        res.status(result.success ? 200 : 401).send(result);
    });
};

exports.fetchUser = async (req, res, next) => {
    const { user } = req;
    res.send(user);
};

const generateToken = user => {
    return jwt.sign({ data: user }, keys.secret, {
        expiresIn: "30 days"
    });
};
