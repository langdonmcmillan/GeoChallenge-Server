import * as mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as _ from "lodash";

import { City, ICity } from "../models/city";
import Difficulty from "../enums/difficulty";

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

export const getRandomCity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { difficulty, cities } = req.body;
    const difficultyFilters = getDifficultyFilters(_.upperCase(difficulty));

    const previousCities = cities.map((city: ICity) => city._id);

    City.aggregate(
        [
            {
                $match: {
                    population: { $gt: difficultyFilters.population },
                    _id: { $nin: previousCities }
                }
            },
            { $sample: { size: 1 } }
        ],
        (error: Error, city: ICity) => {
            if (error) return res.status(500).send({ message: error });

            if (city) {
                return res.json(city);
            }
        }
    );
};

const getDifficultyFilters = (difficulty: string): { population: number } => {
    const filters = {
        population: 0
    };
    switch (difficulty) {
        case Difficulty.Easy:
            filters.population = 1500000;
            break;
        case Difficulty.Medium:
            filters.population = 1000000;
            break;
        case Difficulty.Hard:
            filters.population = 500000;
            break;
        default:
            throw new Error("Invalid difficulty.");
    }
    return filters;
};
