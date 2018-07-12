import * as passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid/v1";
import { Response, Request, NextFunction } from "express";

import Keys from "../config/keys";
import { IUser, User } from "../models/user/user";

const errorMessage = "An error occurred. Please try again later.";
const noUser = "No user with that User Name/Email was found.";
const wrongPassword = "Password does not match user record.";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    User.findById(jwt_payload.data, function(error, user) {
        if (error) {
            done(error, false);
        }
        if (user) {
            done(undefined, user);
        } else {
            done(undefined, false);
        }
    });
});

export const requireAuthentication = passport.authenticate("jwt", {
    session: false
});

export const generateToken = (userId: string, isGuest: boolean = false) => {
    return jwt.sign({ data: userId }, Keys.secret, {
        expiresIn: isGuest ? "1 day" : "30 days"
    });
};

export const getUserFromToken = async (
    token: string
): Promise<{ user: IUser; token: string }> => {
    let user;
    try {
        const decodedObject: any = jwt.verify(token, Keys.secret);
        const existingUser = await User.findById(decodedObject.data);
        if (existingUser) {
            user = existingUser;
        } else {
            user = generateGuestUser();
            token = generateToken(user.id);
        }
    } catch (error) {
        console.log("Error: " + error);
        user = generateGuestUser();
        token = generateToken(user.id);
    }
    return { user, token };
};

const generateGuestUser = () => {
    const user = new User({
        userName: `Guest ${uuid()}`,
        password: uuid()
    });
    user.save(error => {
        if (error) throw new Error("Error: " + error);
    });
    return user;
};

passport.use(jwtLogin);
