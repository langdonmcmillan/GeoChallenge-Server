import City from "../location/city";
import Guess from "./guess";

export default interface Round {
    id: number;
    city: City;
    guesses: Guess[];
    createdDate: Date;
    updatedDate: Date;
}
