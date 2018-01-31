import * as mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as _ from "lodash";

import { City, ICity } from "../models/city";

export const getCity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, id } = req.query;
    if (!name && !id)
        return res.status(400).send({
            message:
                "Please provide the city name, id, or request a random city."
        });

    City.find(
        { $or: [{ name: new RegExp(name, "i") }, { _id: id }] },
        (error, city: ICity) => {
            if (error)
                return res.status(500).send({ message: "An error occurred." });
            if (city) {
                return res.send(city);
            } else {
                return res.status(400).send({
                    message: "Could not find city with given name or id."
                });
            }
        }
    );
};
