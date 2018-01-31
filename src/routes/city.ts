import * as passport from "passport";
import { Express } from "express";

import * as CityController from "../controllers/cityController";

export default (app: Express) => {
    // Gets an array of cities given an id or name.
    app.get("/api/city", CityController.getCity);
};
