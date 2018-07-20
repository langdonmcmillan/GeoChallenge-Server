import { Response, Request, Express } from "express";
import * as socketIo from "socket.io";

import { addUser } from "../Services/user/userService";
import { requireAuthentication } from "../Middlewares/authenticationMiddleware";

export const registerLobbyRoutes = (app: Express, io: socketIo.Server) => {
    // socket for lobby
    // app.get("/api/lobby", requireAuthentication, subscribeToLobby);
    io.on("connection", (socket: socketIo.Socket) => {
        subscribeToLobby(io, socket);
    });
};

export const registerUser = async (req: Request, res: Response) => {
    const { user } = req.body;
    const response = await addUser(user);
    return res.status(response.status).send(response.data);
};

export const subscribeToLobby = async (
    io: socketIo.Server,
    socket: socketIo.Socket
) => {
    socket.on("lobby message", (message: string) => {
        console.log("lobby message", message);
        socket.emit("lobby message", message);
    });
};
