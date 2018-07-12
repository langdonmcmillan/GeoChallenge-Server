import Continent from "./continent";

export default interface Country {
    id: number;
    name: string;
    continent: Continent;
}
