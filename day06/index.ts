import { readFileSync } from "fs";
import { equal } from "assert";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

type Character = "^" | "#" | "." | ">" | "<" | "V" | "X";
type Coord = [number, number];
type Map = Character[][];
type Orientation = "N" | "E" | "S" | "W";
type Movement = {
  character: Character;
  movement: Coord;
  turn: Orientation;
};

const INPUT = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => char as Character));

const TEST = test
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => char as Character));

const movements: { [key in Orientation]: Movement } = {
  N: { character: "^", movement: [0, -1], turn: "E" },
  E: { character: ">", movement: [1, 0], turn: "S" },
  S: { character: "V", movement: [0, 1], turn: "W" },
  W: { character: "<", movement: [-1, 0], turn: "N" },
};

class Guard {
  X: number;
  Y: number;
  orientation: Orientation;
  path: Coord[];
  MAP: Map;

  constructor(position: Coord, orientation: Orientation, map: Map) {
    this.X = position[0];
    this.Y = position[1];
    this.orientation = orientation;
    this.path = [position];
    this.MAP = map;
  }

  step() {
    let { movement } = movements[this.orientation];
    let nextX = this.X + movement[0];
    let nextY = this.Y + movement[1];
    if (this.MAP[nextY][nextX] === "#") {
      this.turn();
      this.step();
    } else {
      this.X = nextX;
      this.Y = nextY;
      this.path.push([this.X, this.Y]);
    }
  }

  turn() {
    this.orientation = movements[this.orientation].turn;
  }
}

equal(part1(TEST), 41);
equal(part1(INPUT), 5534);

function part1(map: Map) {
  let startingPosition = findCharacter(map, "^");
  let orientation: Orientation = "N";
  let outOfBounds = false;
  let guard = new Guard(startingPosition, orientation, map);
  while (!outOfBounds) {
    //renderMap(map, guard);
    let { movement } = movements[guard.orientation];
    let potentialX = guard.X + movement[0];
    let potentialY = guard.Y + movement[1];
    if (
      potentialX < 0 ||
      potentialX > map[0].length - 1 ||
      potentialY < 0 ||
      potentialY > map.length - 1
    ) {
      outOfBounds = true;
      break;
    }
    guard.step();
  }
  const set = new Set(
    guard.path.map(JSON.stringify as (value: Coord) => string),
  );
  return set.size;
}

function renderMap(map: Map, guard: Guard) {
  console.clear();
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (x === guard.X && y === guard.Y) {
        char = movements[guard.orientation].character;
      }
      line += char;
    }
    console.log(line);
  }
  sleep(10);
}

// equal(part2(test), 0);
// equal(part2(input), 0);

function findCharacter(map: Character[][], char: Character): Coord {
  for (let y = 0; y < map.length; y++) {
    let found = map[y].indexOf("^");
    if (found > 0) return [found, y];
  }
}

function part2(input: string): number {
  return 0;
}

function sleep(milliseconds: number) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
