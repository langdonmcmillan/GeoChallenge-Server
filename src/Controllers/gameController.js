// import { Response, Request, NextFunction } from "express";
//
// import { getUserFromToken } from "../services/authentication";
// import { Game, IGame, IRound, IGuess } from "../models/game/game";
// import { ICity, City } from "../models/location/city";
// import {
//     addGuess,
//     getDifficultyFilters,
//     closePreviousQuestions
// } from "../services/game";
//
// export default (app: Express) => {
//     // Creates initial game state
//     app.post("/api/game", createGame);
//     // Takes in the game state and returns a random city given the game settings
//     app.get("/api/game/city", getRandomCity);
//     // Takes in the game state and returns a random city given the game settings
//     app.post("/api/game/city", addCity);
// };
//
// export const createGame = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { user, token } = await getUserFromToken(
//         req.headers["authorization"].replace(/^Bearer\s/i, "")
//     );
//     const { difficulty } = req.body;

//     if (!difficulty)
//         return res.status(400).send({ message: "Missing required options." });
//
//     let game = new Game({
//         difficulty: _.toUpper(difficulty),
//         users: [user],
//         rounds: []
//     });
//     try {
//         game = await game.save();
//         res.json({ game, token });
//     } catch (error) {
//         console.log("Error: ", error);
//         res.status(500).send({ message: "An error occurred" });
//     }
// };
//
// export const addCity = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { user, token } = await getUserFromToken(
//         req.headers["authorization"].replace(/^Bearer\s/i, "")
//     );
//     const { gameId, guess } = req.body;
//     try {
//         const game: IGame = await Game.findById(gameId).populate("rounds.city");
//         const updatedGame = await addGuess(game, guess);
//         await updatedGame.save();
//         res.send(updatedGame);
//     } catch (error) {
//         console.log("Error: ", error);
//         res.status(500).send({ message: "An error occurred" });
//     }
// };
//
// export const getRandomCity = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { gameId } = req.query;
//     const game: IGame = await Game.findById(gameId).populate("rounds.city");
//     const difficultyFilters = getDifficultyFilters(game.difficulty);
//     const previousCities: string[] = game.rounds.map(round => round.city._id);
//     City.aggregate(
//         [
//             {
//                 $match: {
//                     population: { $gt: difficultyFilters.population },
//                     _id: { $nin: previousCities }
//                 }
//             },
//             { $sample: { size: 1 } }
//         ],
//         async (error: Error, city: ICity[]) => {
//             if (error) return res.status(500).send({ message: error });
//
//             if (city) {
//                 const updatedGame = closePreviousQuestions(game);
//                 updatedGame.rounds = updatedGame.rounds.concat({
//                     city: city[0],
//                     guesses: [],
//                     number: game.rounds.length + 1
//                 });
//                 await updatedGame.save();
//                 res.send(updatedGame);
//             }
//         }
//     );
// };
