const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");
const ExtractJwt = require("passport-jwt").ExtractJwt;

const keys = require("../config/keys");
const User = require("../models/user");

const errorMessage = "An error occurred. Please try again later.";
const noUser = "No user with that User Name/Email was found.";
const wrongPassword = "Password does not match user record.";

const localLogin = function(userName, password, callback) {
    try {
        let result = { success: false, message: "", user: false };

        User.findOne(
            { $or: [{ userName: userName }, { email: userName }] },
            function(error, user) {
                if (!user) {
                    result.message = noUser;
                    return callback(result);
                } else {
                    user.comparePassword(password, function(error, isMatch) {
                        if (!isMatch) {
                            result.message = wrongPassword;
                            return callback(result);
                        }
                        result.success = true;
                        result.user = user;
                        return callback(result);
                    });
                }
            }
        );
    } catch (error) {
        result.message = errorMessage;
        return callback(result);
    }
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    User.findById(jwt_payload.data, function(error, user) {
        if (error) {
            return done(error, false, { message: errorMessage });
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: noUser });
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = {
    requireAuthentication: passport.authenticate("jwt", { session: false }),
    loginUser: localLogin
};
