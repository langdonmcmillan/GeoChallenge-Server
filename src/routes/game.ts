import * as passport from "passport";
import { Express } from "express";

import * as GameController from "../controllers/gameController";

export default (app: Express) => {
    // Creates initial game state
    app.post("/api/game", GameController.createGame);
    // Takes in an updated game state and saves
    app.put("/api/game");
};
