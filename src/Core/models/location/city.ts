import Province from "./province";
import { Country } from "aws-sdk/clients/wafregional";

export default interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    population: number;
    province: Province;
    country: Country;
}
