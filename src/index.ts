import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketIo from "socket.io";
import * as http from "http";

import { registerUserRoutes } from "./Controllers/userController";
import { registerLoginRoutes } from "./Controllers/loginController";
import { registerLobbyRoutes } from "./Controllers/lobbyController";
import { authenticateUser } from "./Middlewares/authenticationMiddleware";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(authenticateUser);

registerUserRoutes(app);
registerLoginRoutes(app);
registerLobbyRoutes(app, io);

const PORT = process.env.PORT || 5000;
server.listen(PORT);
