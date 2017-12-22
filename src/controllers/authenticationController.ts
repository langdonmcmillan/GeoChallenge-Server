import * as jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";

import keys from "../config/keys";
import { default as User, UserModel } from "../models/user";

const errorMessage = "An error occurred. Please try again later.";
const noUser = "No user with that User Name/Email was found.";
const wrongPassword = "Password does not match user record.";

export const signup = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, userName } = req.body;

    if (!email || !password)
        return res
            .status(400)
            .send({ message: "Email and password required." });
    User.findOne(
        { $or: [{ userName: userName }, { email: email }] },
        (error, existingUser: UserModel) => {
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
            function(error, user: UserModel) {
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
                                const token = generateToken(user.id);
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

export const fetchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req;
    res.send(user);
};

const generateToken = (userId: string) => {
    return jwt.sign({ data: userId }, keys.secret, {
        expiresIn: "30 days"
    });
};
