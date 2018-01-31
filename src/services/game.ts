import Difficulty from "../enums/difficulty";
import { Game, IGame, IRound, IGuess } from "../models/game";
import { ICity, City } from "../models/city";

export const getDifficultyFilters = (
    difficulty: string
): { population: number } => {
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

export const addGuess = async (game: IGame, guess: IGuess): Promise<IGame> => {
    const currentRound = game.rounds[game.rounds.length - 1];
    const currentCity = await City.findById(currentRound.city);
    guess.score = calculateScore(currentCity, guess);
    currentRound.guesses = currentRound.guesses.concat(guess);
    return game;
};

export const calculateScore = (city: ICity, guess: IGuess): number => {
    const distance = calculateDistance(city, guess);

    return 100 * Math.sqrt(guess.time / 10) / (distance / 1000);
};

export const calculateDistance = (city: ICity, guess: IGuess): number => {
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

const degreesToRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
};

export const closePreviousQuestions = (game: IGame) => {
    game.rounds.forEach(round => {
        if (!round.guesses.length) {
            game.users.forEach(user => {
                round.guesses = round.guesses.concat({
                    user,
                    coordinates: { latitude: 0, longitude: 0 },
                    time: 0,
                    score: 0
                });
            });
        }
    });
    return game;
};
