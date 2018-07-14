import * as express from "express";
import * as bodyParser from "body-parser";

import { registerUserRoutes } from "./Controllers/userController";
import { registerLoginRoutes } from "./Controllers/loginController";

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

registerUserRoutes(app);
registerLoginRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
