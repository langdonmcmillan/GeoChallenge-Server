import Difficulty from "../../enums/difficulty";
import { User } from "aws-sdk/clients/iam";
import Round from "./round";

export default interface Game {
    id: number;
    difficulty: Difficulty;
    isActive: boolean;
    users: User[];
    rounds: Round[];
    createdDate: Date;
    updatedDate: Date;
}
