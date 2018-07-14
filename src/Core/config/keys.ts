import Prod from "./prod";
import Dev from "./dev";

const Keys = process.env.NODE_ENV === "production" ? Prod : Dev;

export default Keys;
