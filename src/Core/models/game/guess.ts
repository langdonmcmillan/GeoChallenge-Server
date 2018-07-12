import { User } from "aws-sdk/clients/iam";

export default interface Guess {
    id: number;
    user: User;
    latitude: number;
    longitude: number;
    time: number;
    score: number;
    createdDate: Date;
    updatedDate: Date;
}
