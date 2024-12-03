let fs = require("fs/promises");
let path = require("path");

(async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, "input.txt"), "utf8");
    let [listA, listB] = splitList(data);
    //Puzzle 01
    let difference = calculateDifference(listA, listB);
    //Puzzle 02
    let similarity = calculateSimilarityScore(listA, listB);
    console.log({ difference, similarity });
  } catch (err) {
    console.error(err);
  }
})();

function calculateSimilarityScore(listA: number[], listB: number[]): number {
  let similarityScore = 0;
  for (const numberA of listA) {
    let occurences = listB.filter((numberB) => numberB === numberA).length;
    similarityScore += numberA * occurences;
  }
  return similarityScore;
}

function calculateDifference(listA: number[], listB: number[]): number {
  let total = listA.reduce(
    (total, value, index) => total + Math.abs(value - listB[index]),
    0,
  );
  return total;
}

//Split array of strings into separate lists
function splitList(list: string): number[][] {
  let pairs = list.split("\n");
  let A: number[] = [];
  let B: number[] = [];
  for (const pair of pairs) {
    let [a, b] = pair.split("  ");
    if (a && b) {
      A.push(parseInt(a), 10);
      B.push(parseInt(b), 10);
    }
  }
  return [A.sort(), B.sort()];
}
