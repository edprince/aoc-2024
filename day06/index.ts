import { readFileSync } from "fs";
import { equal } from "assert";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

// equal(part1(test), 41);
// equal(part1(input), 5534);

type Character = "^" | "#" | "." | ">" | "<" | "V" | "X";
type Coord = [number, number];
type Map = Character[][];
type Orientation = "N" | "E" | "S" | "W";

const MAP = test
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => char as Character));

type Cardinal = {
  character: Character;
  movement: Coord;
  turn: Orientation;
};

const cardinals: { [key in Orientation]: Cardinal } = {
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

  constructor(position: Coord, orientation: Orientation) {
    this.X = position[0];
    this.Y = position[1];
    this.orientation = orientation;
    this.path = [position];
  }

  move() {
    let nextX = this.X;
    let nextY = this.Y;
    let { movement } = cardinals[this.orientation];
    nextX = this.X + movement[0];
    nextY = this.Y + movement[1];
    if (MAP[nextY][nextX] === "#") {
      this.turn();
      this.move();
    } else {
      this.X = nextX;
      this.Y = nextY;
      this.path.push([this.X, this.Y]);
    }
  }

  turn() {
    console.log(
      "Turning from ",
      this.orientation,
      " to ",
      cardinals[this.orientation].turn,
    );
    this.orientation = cardinals[this.orientation].turn;
  }
}

function newPart1() {
  let startingPosition = findCharacter(MAP, "^");
  let orientation: Orientation = "N";
  let outOfBounds = false;
  let guard = new Guard(startingPosition, orientation);
  while (!outOfBounds) {
    newRender(guard);

    sleep(100);
    guard.move();
    if (guard.X < 0) outOfBounds = true;
    if (guard.X > MAP[0].length) outOfBounds = true;
    if (guard.Y < 0) outOfBounds = true;
    if (guard.Y > MAP.length) outOfBounds = true;
  }
  console.log(guard.path);
}

newPart1();

function newRender(guard: Guard) {
  console.clear();
  for (let y = 0; y < MAP.length; y++) {
    let line = "";
    for (let x = 0; x < MAP[y].length; x++) {
      let char = MAP[y][x];
      if (x === guard.X && y === guard.Y) {
        char = cardinals[guard.orientation].character;
      }
      line += char;
    }
    console.log(line);
  }
}

// equal(part2(test), 0);
// equal(part2(input), 0);

function part1(input: string): number {
  let map = input
    .split("\n")
    .slice(0, -1)
    .map((line) => line.split("").map((char) => char as Character));
  let startingPosition = findCharacter(map, "^");
  let orientation: Orientation = "N";
  let outOfBounds = false;
  let path = [startingPosition];
  while (!outOfBounds) {
    let { pos, facing } = move(path[path.length - 1], orientation, map);
    path.push(pos);
    orientation = facing;
    if (pos[1] === 0 && orientation === "N") outOfBounds = true;
    if (
      0 > pos[0] ||
      0 > pos[1] ||
      pos[0] >= map[0].length - 1 ||
      pos[1] >= map.length - 1
    ) {
      outOfBounds = true;
    }
  }
  let uniq = Array.from(new Set(path.map((coord) => JSON.stringify(coord))));
  console.log({ len: uniq.length });
  return uniq.length;
}

function move(
  position: Coord,
  orientation: Orientation,
  map: Map,
): { pos: Coord; facing: Orientation } {
  //sleep(10);
  //Figure out what the next tile should be
  let [nextX, nextY] = findOrientation(position, orientation);
  let loopCounter = 0;
  while (map[nextY][nextX] === "#") {
    loopCounter += 1;
    if (loopCounter > 4) {
      console.error("Stuck in a loop");
      break;
    }
    if (orientation === "N") orientation = "E";
    if (orientation === "E") orientation = "S";
    if (orientation === "S") orientation = "W";
    if (orientation === "W") orientation = "N";
    [nextX, nextY] = findOrientation(position, orientation);
  }
  return { pos: [nextX, nextY], facing: orientation };
}

function renderMap(
  map: Map,
  position: Coord,
  orientation: Orientation,
  path: Coord[],
) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (x === position[0] && y === position[1]) {
        if (orientation === "N") char = "^";
        if (orientation === "E") char = ">";
        if (orientation === "S") char = "V";
        if (orientation === "W") char = "<";
      }
      line += char;
    }
    console.log(line);
  }
}

function findOrientation(position: Coord, orientation: Orientation): Coord {
  let nextX = position[0];
  let nextY = position[1];
  if (orientation === "N") nextY -= 1;
  if (orientation === "E") nextX += 1;
  if (orientation === "S") nextY += 1;
  if (orientation === "W") nextX -= 1;
  return [nextX, nextY];
}

function findCharacter(map: Character[][], char: Character): Coord {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) {
        return [x, y];
      }
    }
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
