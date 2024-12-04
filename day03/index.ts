import { readFileSync } from "fs";

const data = readFileSync("./input.txt", { encoding: "utf8" });
part1(data);
part2(data);

function part1(data: string) {
  //Use regex to find all mul(X,Y) operations
  let validOperations = extractOperations(data);
  let total = processOperations(validOperations);
  console.log({ part1: total });
}

function part2(data: string) {
  //Split into "don't()"" chunks. Each chunk is invalid until
  //the first do(). Then all are valid (no more donts because the instructions split)
  let chunks = data.split("don't()");
  let part2total = 0;
  for (let i = 0; i < chunks.length; i++) {
    let dos = chunks[i].split("do()");
    //The very first block is valid, as it is before the first don't
    if (i > 0) {
      //Remove the string up until the first do()
      dos.shift();
    }
    part2total += parseChunks(dos);
  }

  console.log({ part2: part2total });
}

/**
 * Takes array of strings containing operations and returns multiplied totals
 * @param chunk - array of strings
 * @returns total - number
 */
function parseChunks(chunk: string[]): number {
  let total = 0;
  for (const doInstruction of chunk) {
    //Match all mul(X,Y) operations
    let validOperations = extractOperations(doInstruction);
    //Parse list of mul(X,Y) operations and add to accumulator
    total += processOperations(validOperations);
  }
  return total;
}

/**
 * Pull instructions in format mul(X,Y) out of string
 * @param instructionString  - string
 * @returns array of valid operations
 */
function extractOperations(instructionString: string): string[] {
  let regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
  return instructionString.match(regex);
}

/**
 * Take list of instructions and return totalled outputs
 * @param operations array of operations
 * @returns
 */
function processOperations(operations: string[]): number {
  let total = 0;
  for (const operation of operations) {
    total += executeOperation(operation);
  }
  return total;
}

/**
 * Take instruction like mul(XYZ, AB) and return the multiplied total
 * @param instruction string
 * @returns number
 */
function executeOperation(operation: string): number {
  //Get the two operands from operations
  let [a, b] = operation.slice(4, operation.length - 1).split(",");
  return parseInt(a) * parseInt(b);
}
