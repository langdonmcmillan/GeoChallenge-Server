import Prod from "./prod";
import Dev from "./dev";

const keys = process.env.NODE_ENV === "production" ? Prod : Dev;

export default keys;
