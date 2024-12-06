import { readFileSync } from "fs";
import { equal } from "assert";
import { Map, Character, Coord } from "./types";
import movements from "./movements";
import Guard from "./guard";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

const INPUT = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => char as Character));

const TEST = test
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => char as Character));

(async function runTests() {
  const resultTest = await part1(TEST);
  const resultInput = await part1(INPUT);
  const result2Test = await part2(TEST);

  equal(resultTest, 41);
  equal(resultInput, 5534);
})();

async function part1(map: Map) {
  let outOfBounds = false;
  let startingPosition = findCharacter(map, "^");
  let guard = new Guard(startingPosition, "N", map);
  while (!outOfBounds) {
    //await renderMap(map, guard);
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
  console.log({ Visited: set.size });
  return set.size;
}

// equal(part2(test), 0);
// equal(part2(input), 0);

function findCharacter(map: Character[][], char: Character): Coord {
  for (let y = 0; y < map.length; y++) {
    let found = map[y].indexOf("^");
    if (found > 0) return [found, y];
  }
}

async function part2(map: Map) {
  let outOfBounds = false;
  let startingPosition = findCharacter(map, "^");
  let guard = new Guard(startingPosition, "N", map);
  while (!outOfBounds) {
    //await renderMap(map, guard);
    let { movement } = movements[guard.orientation];
    let potentialX = guard.X + movement[0];
    let potentialY = guard.Y + movement[1];

    // Check for intersection
    if (
      guard.path.find(
        (tile) => tile[0] === potentialX && tile[1] === potentialY,
      )
    ) {
      console.log("Intersection!");
      let obstruction = [potentialX + movement[0], potentialY + movement[1]];
      console.log({ obstruction });
    }
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

  return 0;
}

async function sleep(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function renderMap(map: Map, guard: Guard) {
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
  await sleep(100);
}

//How to determine a loop
//Guard always hits obstacles
//Every time the guard hits an obstacle, run a check to see if a new obstacle returns
//guard to obstacles[i - 2];

//Other way of thinking about it, is if you can cause the same
//two coords to be added to the path. That means he has to be following
//the same path as earlier.

//It's whenever the coords intersect with the path!
//When the coords intersect, add an obstacle at intersection + 1 in current orientation
//Only works for the last 3 turns! Old path lines can be intersected no problem

//No... it isn't. It doesn't need to be a perfect square loop.
//As long as it gets the guard onto any previous part of the path, it's valid

//The obstacle has to be somewhere on the path
//It has to cause the guard to land on a section of path he's already been on, facing the same direction
