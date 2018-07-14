import { Response, Request, Express } from "express";

import * as UserService from "../Services/user/userService";
import * as AuthenticationMiddleware from "../Middlewares/authenticationMiddleware";

export const registerUserRoutes = (app: Express) => {
    // Creates user record.
    app.post("/api/user", addUser);
    // Returns user information after authenticating the given token
    app.get(
        "/api/user",
        AuthenticationMiddleware.authenticateUser,
        AuthenticationMiddleware.requireAuthentication,
        getUser
    );
};

export const addUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const response = await UserService.createUser(name, email, password);
    return res.status(response.status).send(response);
};

export const getUser = async (req: Request, res: Response) => {
    const { user } = req;
    res.send(user);
};
