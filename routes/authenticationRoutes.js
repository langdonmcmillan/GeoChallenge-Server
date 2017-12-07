const passport = require("passport");

const AuthenticationController = require("../controllers/authenticationController");
const AuthenticationService = require("../services/authentication");

module.exports = app => {
    app.post("/signup", AuthenticationController.signup);
    app.get(
        "/test",
        AuthenticationService.requireAuthentication,
        (req, res) => {
            res.send({ hi: "there" });
        }
    );
    app.post(
        "/login",
        AuthenticationService.requireLogin,
        AuthenticationController.login
    );
};

/* const passport = require("passport");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

module.exports = app => {
    app.post("/user/signup", function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.status(400).send("Username and Password Required");
        } else {
            var newUser = new User({
                userName: req.body.username,
                password: req.body.password
            });
            newUser.save(function(error, user) {
                if (error) {
                    return res.json({
                        success: false,
                        message: "Username already exists."
                    });
                }
                const token = generateToken(user);
                res.json({
                    success: true,
                    message: "User Created.",
                    user: { userName: user.userName, _id: user._id.toString() },
                    token: token
                });
            });
        }
    });

    app.post("/user/login", function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.status(400).send("Username and Password Required");
        } else {
            User.findOne(
                {
                    userName: req.body.username
                },
                function(error, user) {
                    if (error) res.status(500).send("An error occurred.");
                    if (!user) {
                        res.status(401).send({
                            success: false,
                            message: "User does not exist."
                        });
                    } else {
                        user.comparePassword(req.body.password, function(
                            error,
                            isMatch
                        ) {
                            if (isMatch && !error) {
                                var userObject = {
                                    userName: user.userName,
                                    _id: user._id.toString()
                                };
                                var token = generateToken(userObject);
                                res.json({
                                    success: true,
                                    token: token,
                                    user: userObject
                                });
                            } else {
                                res.status(401).send({
                                    success: false,
                                    message: "Incorrect password."
                                });
                            }
                        });
                    }
                }
            );
        }
    });

    app.post("/user/current", requireToken, function(req, res) {
        const token = req;
    });
};

const generateToken = user => {
    return jwt.sign(user, keys.secret, { expiresIn: 60 * 60 * 24 * 30 });
};
 */
