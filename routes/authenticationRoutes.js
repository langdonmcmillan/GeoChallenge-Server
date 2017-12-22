const passport = require("passport");

const AuthenticationController = require("../controllers/authenticationController");
const AuthenticationService = require("../services/authentication");

module.exports = app => {
    app.post("/api/signup", AuthenticationController.signup);
    app.get(
        "/api/user",
        AuthenticationService.requireAuthentication,
        AuthenticationController.fetchUser
    );
    app.post("/api/login", AuthenticationController.login);
};
