import { readFileSync } from "fs";
import { equal } from "assert";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

equal(part1(test), 143);
equal(part1(input), 5275);

equal(part2(test), 123);
equal(part2(input), 0);

type Dictionary = {
  [key: string]: string[];
};

function part1(input: string): number {
  let total = 0;
  let [rules, updates] = splitRulesAndUpdates(input);
  let dictionary = createDictionary(rules);
  for (const update of updates) {
    let res = checkDependencies(update, dictionary);
    total += res;
  }
  return total;
}

function part2(input: string): number {
  let [rules, updates] = splitRulesAndUpdates(input);
  let dictionary = createDictionary(rules);
  let total = 0;
  for (const update of updates) {
    let res = checkDependencies(update, dictionary);
    if (!res) {
      //Order update
      let middle = reOrderUpdate(update, dictionary);
      //Add middle to total
      total += middle;
    }
  }
  return total;
}

function splitRulesAndUpdates(input: string): [string[], string[][]] {
  let rules = input.split("\n").slice(0, -1);
  let breakIndex = rules.indexOf("");
  //Separate rules and updates
  let updates = rules
    .slice(breakIndex + 1, rules.length)
    .map((update) => update.split(","));
  rules = rules.slice(0, breakIndex);
  return [rules, updates];
}

function reOrderUpdate(update: string[], dictionary: Dictionary): number {
  //Sort the array by making sure each item comes before any of its dependencies
  update.sort((a: string, b: string) => {
    if (dictionary[a]?.includes(b)) return -1;
    return 0;
  });
  return Number(update[Math.floor(update.length / 2)]);
}

function checkDependencies(update: string[], dictionary: Dictionary): number {
  let ordered = true;
  for (const [index, page] of update.entries()) {
    let preceedingPages = update.slice(0, index);
    let dependencies = dictionary[page];
    if (preceedingPages.length > 0 && dependencies?.length > 0) {
      let dependent = containsDependencies(preceedingPages, dependencies);
      if (dependent) ordered = false;
    }
  }
  let middle = update[Math.floor(update.length / 2)];
  return ordered ? Number(middle) : 0;
}

/**
 * Checks if a set of pages contains any dependencies
 * Used by passing in preceeding pages and making sure a dependency isn't in the preceeding pages
 * @param pages - preceeding pages (array of pages)
 * @param dependencies
 * @returns boolean - whether the preceeding pages do contain a dependency or not
 */
function containsDependencies(pages: string[], dependencies: string[]) {
  let present = false;
  for (const page of pages) {
    if (dependencies.includes(page)) present = true;
  }
  return present;
}

/**
 * Creates a dictionary to see what pages a certain page needs to preceed
 * @param rules - array of | separated dependencies
 * @returns dictionary object
 */
function createDictionary(rules: string[]): Dictionary {
  let rulesDictionary = {};
  for (const rule of rules) {
    let [page, dependency] = rule.split("|");
    if (rulesDictionary[page]) {
      rulesDictionary[page] = [...rulesDictionary[page], dependency];
    } else {
      rulesDictionary[page] = [dependency];
    }
  }

  return rulesDictionary;
}
