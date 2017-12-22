import * as passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";

import Keys from "../config/keys";
import User from "../models/user";

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

passport.use(jwtLogin);
