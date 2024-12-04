import { readFileSync } from "fs";

const data = readFileSync("./input.txt", { encoding: "utf8" });
let reports = data.split("\n");
reports.pop();

const reportArrays = reports.map((level: string) => {
  return level.split(" ").map((lvl: string) => parseInt(lvl));
});
let safe = 0;
for (const report of reportArrays) {
  if (checkSafety(report)) {
    safe += 1;
    continue;
  }

  //Check for dampened safety
  for (let i = 0; i < report.length; i++) {
    let reducedReport = [...report];
    reducedReport.splice(i, 1);
    if (checkSafety(reducedReport)) {
      safe += 1;
      break;
    }
  }
}
console.log({ safe });

function checkSafety(report: number[]) {
  let safe = true;
  let ascending = true;
  let descending = true;
  for (let i = 0; i < report.length - 1; i++) {
    let a = report[i];
    let b = report[i + 1];
    let gap = Math.abs(a - b);

    //Check gap is never bigger than 3
    if (gap > 3) safe = false;
    if (a === b) safe = false;
    //Make sure levels are consistently ascending or descending
    if (a > b) ascending = false;
    if (a < b) descending = false;
  }
  return safe && (ascending || descending);
}
