import * as mongoose from "mongoose";

import { IUser } from "./user";
import { ICity } from "./city";
import Difficulty from "../enums/difficulty";
import { enumToStringArray } from "../utility/enums";

const { Schema } = mongoose;

export interface IRound {
    number: number;
    city: ICity;
    guesses: IGuess[];
}

export interface IGuess {
    user: IUser;
    coordinates: { latitude: number; longitude: number };
    time: number;
    score: number;
}

export interface IGame extends mongoose.Document {
    users: IUser[];
    rounds: IRound[];
    difficulty: Difficulty;
}

const gameSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    rounds: [
        {
            city: { type: Schema.Types.ObjectId, ref: "City" },
            guesses: [
                {
                    user: { type: Schema.Types.ObjectId, ref: "User" },
                    coordinates: { latitude: Number, longitude: Number },
                    time: Number,
                    score: Number
                }
            ],
            number: Number
        }
    ],
    difficulty: { type: String, enum: enumToStringArray(Difficulty) }
});

export const Game: mongoose.Model<IGame> = mongoose.model<IGame>(
    "Game",
    gameSchema
);
