import { readFileSync } from "fs";
import { equal } from "assert";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

equal(part1(test), 18);
equal(part1(input), 2545);

equal(part2(test), 9);
equal(part2(input), 1886);

console.log("Part1: ", part1(input));
console.log("Part2: ", part2(input));

function part2(wordsearch: string): number {
  let grid = wordsearch
    .split("\n")
    //remove empty row at the end
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(""));

  let width = grid[0].length - 1;
  let height = grid.length - 1;
  let total = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (grid[y][x] == "A" && y > 0 && y < height && x > 0 && x < width) {
        //Check diagonals
        let tile1 = grid[y - 1][x - 1];
        let tile2 = grid[y + 1][x + 1];
        let tile3 = grid[y - 1][x + 1];
        let tile4 = grid[y + 1][x - 1];
        if (checkTwoTiles(tile1, tile2) && checkTwoTiles(tile3, tile4)) {
          total += 1;
        }
      }
    }
  }
  return total;
}

function checkTwoTiles(tile1: string, tile2: string): boolean {
  if ((tile1 === "M" && tile2 === "S") || (tile1 === "S" && tile2 === "M")) {
    return true;
  }
  return false;
}

function part1(wordsearch: string): number {
  let grid = [];
  let rows = wordsearch.split("\n");
  for (const line of rows) {
    if (line != "") grid.push(line.split(""));
  }
  let total = 0;
  total += solveHorizontals(rows);
  total += solveVerticals(rows);
  total += calculateDiagonals(grid);

  return total;
}

function calculateDiagonals(grid: string[][]): number {
  let total = 0;

  // TOP going left to right down
  for (let i = 0; i < grid[0].length; i++) {
    total += solveDiagonals(grid, i, 0, { forward: true });
  }

  // LEFT going left to right down
  for (let i = 1; i < grid.length; i++) {
    total += solveDiagonals(grid, 0, i, { forward: true });
  }

  // TOP going right to left down
  for (let i = 0; i < grid[0].length; i++) {
    total += solveDiagonals(grid, i, 0, { forward: false });
  }

  // RIGHT going right to left down
  for (let j = 1; j < grid.length; j++) {
    total += solveDiagonals(grid, grid[0].length - 1, j, { forward: false });
  }

  return total;
}

/**
 * Check through each unsplit row for instances o
 * @param rows
 * @param word
 * @returns
 */
function solveHorizontals(rows: string[]): number {
  let total = 0;
  for (const line of rows) {
    total += solveLine(line);
  }
  return total;
}

function solveVerticals(rows: string[]): number {
  const verticals = rows.slice(0, -1);
  let total = 0;
  for (let i = 0; i < verticals.length; i++) {
    const result = verticals.reduce(
      (acc: string, str: string) => acc + str[i],
      "",
    );
    total += solveLine(result);
  }
  return total;
}

/**
 * Find all examples of a word on a diagonal
 * @param grid - entire wordsearch in a 2d array
 * @param x - starting x axis coordinate
 * @param y - starting y axis coordinate
 * @param { forward } - flag for whether the diagonal goes forward (top left to bottom right, or backward, from to right to bottom left)
 * @param word
 * @returns
 */
function solveDiagonals(
  grid: string[][],
  x: number,
  y: number,
  { forward }: { forward: boolean },
): number {
  let XLength = grid[0].length;
  let YLength = grid.length;
  let diagonal = "";
  //Traverse diagonally until out of bounds
  while (y < YLength && x >= 0 && x < XLength) {
    let val = grid[y][x];
    diagonal += val;
    //+ or - depending on diagonal direction (forward: true/false)
    x += forward ? 1 : -1;
    y++;
  }

  let total = solveLine(diagonal);
  return total;
}

/**
 * Find all instances of a substring (forwards or backwards)
 * @param line - string to search
 * @param word - word to be found [NOT USED YET]
 * @returns
 */
function solveLine(line: string): number {
  let regex = /(?=(XMAS|SAMX))/g;
  let matches = Array.from(line.matchAll(regex), (match) => match[1]);
  return matches ? matches.length : 0;
}
