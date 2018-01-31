import * as passport from "passport";
import { Express } from "express";

import {
    createGame,
    getRandomCity,
    addCity
} from "../controllers/gameController";

export default (app: Express) => {
    // Creates initial game state
    app.post("/api/game", createGame);
    // Takes in the game state and returns a random city given the game settings
    app.get("/api/game/city", getRandomCity);
    // Takes in the game state and returns a random city given the game settings
    app.post("/api/game/city", addCity);
};
