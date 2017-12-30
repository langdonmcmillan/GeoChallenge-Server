import * as mongoose from "mongoose";

const { Schema } = mongoose;

export interface ICity extends mongoose.Document {
    name: string;
    latitude: string;
    longitude: string;
    population: number;
    country: string;
    countryCode2: string;
    countryCode3: string;
    province: string;
}

const citySchema = new Schema({
    name: { type: String, lowercase: true },
    latitude: String,
    longitude: String,
    population: Number,
    country: String,
    countryCode2: String,
    countryCode3: String,
    province: String
});

export const City: mongoose.Model<ICity> = mongoose.model<ICity>(
    "City",
    citySchema
);
