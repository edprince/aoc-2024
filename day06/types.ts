export type Character = "^" | "#" | "." | ">" | "<" | "V" | "X";
export type Coord = [number, number];
export type Map = Character[][];
export type Orientation = "N" | "E" | "S" | "W";
export type Movement = {
  character: Character;
  movement: Coord;
  turn: Orientation;
};
