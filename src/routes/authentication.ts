import * as passport from "passport";
import { Express } from "express";

import * as AuthenticationController from "../controllers/authenticationController";
import * as AuthenticationService from "../services/authentication";

export default (app: Express) => {
    // Creates user record.
    app.post("/api/signup", AuthenticationController.signup);
    // Returns user information after authenticating the given token
    app.get(
        "/api/user",
        AuthenticationService.requireAuthentication,
        AuthenticationController.getUser
    );
    // Logs a user in and returns a token and user information
    app.post("/api/login", AuthenticationController.login);
};
