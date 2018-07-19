import { Response, Request, Express } from "express";

import { addUser } from "../Services/user/userService";
import { requireAuthentication } from "../Middlewares/authenticationMiddleware";

export const registerUserRoutes = (app: Express) => {
    // Creates user record.
    app.post("/api/user", registerUser);
    // Returns user information after authenticating the given token
    app.get("/api/user", requireAuthentication, getUser);
};

export const registerUser = async (req: Request, res: Response) => {
    const { user } = req.body;
    const response = await addUser(user);
    return res.status(response.status).send(response.data);
};

export const getUser = async (req: Request, res: Response) => {
    // User has been retrieved from the token by middleware
    const { user } = req;
    res.send(user);
};
