import * as passport from "passport";
import { Express } from "express";

import * as AuthenticationController from "../controllers/authenticationController";
import * as AuthenticationService from "../services/authentication";

export default (app: Express) => {
    app.post("/api/signup", AuthenticationController.signup);
    app.get(
        "/api/user",
        AuthenticationService.requireAuthentication,
        AuthenticationController.fetchUser
    );
    app.post("/api/login", AuthenticationController.login);
};
