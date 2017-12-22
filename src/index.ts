import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as session from "express-session";
import * as bodyParser from "body-parser";

import Keys from "./config/keys";
import AuthenticationRoutes from "./routes/authentication";

mongoose.connect(Keys.mongoUri);

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(
    session({ secret: "ODvIAJluza", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

AuthenticationRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
