import { Response, Request, Express } from "express";

import { loginUser } from "../services/user/AuthenticationService";
import ResponseObject from "../Core/models/utility/responseObject";

export const registerLoginRoutes = (app: Express) => {
    // Logs a user in and returns a token and user information
    app.post("/api/login", login);
};

export const login = async (req: Request, res: Response) => {
    const { user } = req.body;
    const response: ResponseObject = await loginUser(user);
    res.status(response.status).send(response.data);
};
