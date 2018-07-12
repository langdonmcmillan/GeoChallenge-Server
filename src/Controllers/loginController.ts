import { Response, Request, NextFunction, Express } from "express";

import Keys from "../config/keys";
import User from "../models/user/user";
import { generateToken } from "../services/authentication/authentication";
import * as AuthenticationService from "../services/authentication/authentication";

const errorMessage = "An error occurred. Please try again later.";
const noUser = "No user with that User Name/Email was found.";
const wrongPassword = "Password does not match user record.";

export default (app: Express) => {
    // Creates user record.
    app.post("/api/signup", signup);
    // Returns user information after authenticating the given token
    app.get("/api/user", AuthenticationService.requireAuthentication, getUser);
    // Logs a user in and returns a token and user information
    app.post("/api/login", login);
};

export const signup = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, userName } = req.body;

    if (!email || !password)
        return res
            .status(400)
            .send({ message: "Email and password required." });
    User.findOne(
        { $or: [{ userName: email }, { email: email }] },
        (error, existingUser: IUser) => {
            if (error) return res.status(500).send({ message: errorMessage });

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
                if (error)
                    return res.status(500).send({ message: errorMessage });
                const token = generateToken(user.id);
                res.json({ token, user });
            });
        }
    );
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userName, password } = req.body;
    try {
        User.findOne(
            { $or: [{ userName: userName }, { email: userName }] },
            function(error, user: IUser) {
                if (!user) {
                    res.status(401).send(noUser);
                } else {
                    user.comparePassword(
                        password,
                        (error: Error, isMatch: Boolean) => {
                            if (error) {
                                res.status(401).send(errorMessage);
                            }
                            if (!isMatch) {
                                res.status(401).send(wrongPassword);
                            } else {
                                const token = generateToken(user._id);
                                res.status(200).send({ token, user });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(401).send(errorMessage);
    }
};

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req;
    res.send(user);
};
