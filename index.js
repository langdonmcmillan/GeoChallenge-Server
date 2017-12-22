const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");

const keys = require("./config/keys");

mongoose.connect(keys.mongoUri);

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

require("./routes/authenticationRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
