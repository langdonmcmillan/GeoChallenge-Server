import { verify, VerifyErrors } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

import Keys from "../Core/config/keys";
import { getSingleUser } from "../Services/user/userService";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        const token = req.headers.authorization.split(" ")[1];
        verify(
            token,
            Keys.secret,
            async (err: VerifyErrors, decodedToken: any) => {
                if (err) {
                    req.user = undefined;
                } else {
                    req.user = await getSingleUser(parseInt(decodedToken.data));
                }
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
};

export const requireAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: "Authorization required." });
    }
};
