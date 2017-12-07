const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");
const ExtractJwt = require("passport-jwt").ExtractJwt;

const keys = require("../config/keys");
const User = require("../models/user");

const localLogin = new LocalStrategy(function(username, password, done) {
    User.findOne(
        { $or: [{ userName: username }, { email: username }] },
        function(error, user) {
            if (error) {
                return done(error);
            }
            if (!user) {
                return done(null, false);
            }

            user.comparePassword(password, function(error, isMatch) {
                if (error) {
                    return done(error);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    );
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    console.log("payload", jwt_payload);
    User.findById(jwt_payload.data, function(error, user) {
        if (error) {
            console.log("error", error);
            return done(error, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = {
    requireAuthentication: passport.authenticate("jwt", { session: false }),
    requireLogin: passport.authenticate("local", { session: false })
};
