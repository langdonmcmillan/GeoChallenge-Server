import * as mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as _ from "lodash";

import { getUserFromToken } from "../services/authentication";
import { Game, IGame, IRound, IGuess } from "../models/game";
import { ICity } from "../models/city";

export const createGame = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user, token } = await getUserFromToken(
        req.headers["authorization"].replace(/^Bearer\s/i, "")
    );
    const { difficulty } = req.body;

    if (!difficulty)
        return res.status(400).send({ message: "Missing required options." });

    let game = new Game({
        difficulty: _.toUpper(difficulty),
        users: [user],
        rounds: []
    });
    try {
        game = await game.save();
        res.json({ token, game });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ message: "An error occurred" });
    }
};

export const updateGame = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user, token } = await getUserFromToken(
        req.headers["authorization"].replace(/^Bearer\s/i, "")
    );
    const { rounds, _id } = req.body;

    let game: IGame = await Game.findById(_id);
    game.rounds = updateRounds(rounds);

    try {
        game = await game.save();
        res.send(game);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ message: "An error occurred" });
    }
};

const updateRounds = (rounds: IRound[]) => {
    rounds = rounds.map(round => {
        round.guesses.forEach(guess => {
            if (!guess.score || guess.score === 0) {
                guess.score = calculateScore(round.city, guess);
            }
        });
        return round;
    });
    return rounds;
};

const calculateScore = (city: ICity, guess: IGuess) => {
    const distance = calculateDistance(city, guess);

    return 100 * Math.sqrt(guess.time / 10) / (distance / 1000);
};

const calculateDistance = (city: ICity, guess: IGuess) => {
    const earthRadiusKm = 6371;

    const correctCoordinates: { latitude: number; longitude: number } = {
        latitude: parseFloat(city.latitude),
        longitude: parseFloat(city.longitude)
    };

    const guessCoordinates = guess.coordinates;
    const degreesLatitude = degreesToRadians(
        correctCoordinates.latitude - guessCoordinates.latitude
    );
    const degreesLongitude = degreesToRadians(
        correctCoordinates.longitude - guessCoordinates.longitude
    );

    const correctLatitudeRadians = degreesToRadians(
        correctCoordinates.latitude
    );
    const guessLatitudeRadians = degreesToRadians(guessCoordinates.latitude);

    const a =
        Math.sin(degreesLatitude / 2) * Math.sin(degreesLatitude / 2) +
        Math.sin(degreesLongitude / 2) *
            Math.sin(degreesLongitude / 2) *
            Math.cos(correctLatitudeRadians) *
            Math.cos(guessLatitudeRadians);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
}
