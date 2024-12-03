"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readFile_1 = require("../readFile");
(0, readFile_1.default)("day03/input", function (data) {
    //Part 1
    //Use regex to find all mul(X,Y) operations
    var validOperations = extractOperations(data);
    var total = multiplyOperations(validOperations);
    console.log({ part12: total });
    //Part 2
    //Split into "don't()"" chunks. Each chunk is invalid until
    //the first do(). Then all are valid (no more donts because the instructions split)
    var chunks = data.split("don't()");
    var part2total = 0;
    for (var i = 0; i < chunks.length; i++) {
        var dos = chunks[i].split("do()");
        //The very first block is valid, as it is before the first don't
        if (i > 0) {
            //Remove the string up until the first do()
            dos.shift();
        }
        part2total += parseChunks(dos);
    }
    console.log({ part2: part2total });
});
/**
 * Takes array of strings containing operations and returns multiplied totals
 * @param chunk - array of strings
 * @returns total - number
 */
function parseChunks(chunk) {
    var total = 0;
    for (var _i = 0, chunk_1 = chunk; _i < chunk_1.length; _i++) {
        var doInstruction = chunk_1[_i];
        //Match all mul(X,Y) operations
        var validOperations = extractOperations(doInstruction);
        //Parse list of mul(X,Y) operations and add to accumulator
        total += multiplyOperations(validOperations);
    }
    return total;
}
/**
 * Pull instructions in format mul(X,Y) out of string
 * @param instructionString  - string
 * @returns array of valid operations
 */
function extractOperations(instructionString) {
    var regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
    return instructionString.match(regex);
}
/**
 * Take list of instructions and return totalled outputs
 * @param operations array of operations
 * @returns
 */
function multiplyOperations(operations) {
    var total = 0;
    for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
        var operation = operations_1[_i];
        total += parseInstruction(operation);
    }
    return total;
}
/**
 * Take instruction like mul(XYZ, AB) and return the multiplied total
 * @param instruction string
 * @returns number
 */
function parseInstruction(instruction) {
    //Get the two operands from operations
    var _a = instruction.slice(4, instruction.length - 1).split(","), a = _a[0], b = _a[1];
    return parseInt(a) * parseInt(b);
}
