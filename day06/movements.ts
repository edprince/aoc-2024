import { Orientation, Movement } from "./types";

//Calculate character to be rendered, movement vector and which way would be turned
//from any given orientation
const movements: { [key in Orientation]: Movement } = {
  N: { character: "^", movement: [0, -1], turn: "E" },
  E: { character: ">", movement: [1, 0], turn: "S" },
  S: { character: "V", movement: [0, 1], turn: "W" },
  W: { character: "<", movement: [-1, 0], turn: "N" },
};

export default movements;
