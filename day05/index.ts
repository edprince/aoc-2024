import { readFileSync } from "fs";
import { equal } from "assert";
import { O } from "nextra/dist/types-c8e621b7";

const test = readFileSync("./testInput.txt", { encoding: "utf8" });
const input = readFileSync("./input.txt", { encoding: "utf8" });

equal(part1(test), 143);
equal(part1(input), 5275);

equal(part2(test), 123);
equal(part2(input), 6191);

type Dictionary = {
  [key: string]: string[];
};

function part1(input: string): number {
  let [rules, updates] = splitRulesAndUpdates(input);
  let dictionary = createDictionary(rules);

  return updates.reduce((total, update) => {
    return total + validateUpdate(update, dictionary);
  }, 0);
}

function part2(input: string): number {
  let [rules, updates] = splitRulesAndUpdates(input);
  let dictionary = createDictionary(rules);

  return updates.reduce((total: number, update: string[]) => {
    if (!validateUpdate(update, dictionary)) {
      return total + reOrderUpdate(update, dictionary);
    }
    return total;
  }, 0);
}

/**
 * Takes string input and splits into usable data structures
 * @param input - string
 * @returns array of upages, and a dictionary of page dependencies
 */
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

/**
 * Sorts an update based on required pages
 * @param update - array of pages
 * @param dictionary - rules for page-dependencies
 * @returns middle number of a sorted update
 */
function reOrderUpdate(update: string[], dictionary: Dictionary): number {
  //Sort the array by making sure each item comes before any of its dependencies
  update.sort((a: string, b: string) => {
    if (dictionary[a]?.includes(b)) return -1;
    return 0;
  });
  return Number(update[Math.floor(update.length / 2)]);
}

/**
 *
 * @param update
 * @param dictionary
 * @returns
 */
function validateUpdate(update: string[], dictionary: Dictionary): number {
  let ordered = true;
  for (const [index, page] of update.entries()) {
    //Check that none of the preceeding pages are a dependency of this page
    let preceedingPages = update.slice(0, index);
    let dependencies = dictionary[page];
    if (preceedingPages.length > 0 && dependencies?.length > 0) {
      if (containsDependencies(preceedingPages, dependencies)) ordered = false;
    }
  }
  return ordered ? Number(update[Math.floor(update.length / 2)]) : 0;
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
