import { nextGeneration } from "./src/game-of-life.js";

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

console.log("INPUT:");
grid.forEach((row, i) => console.log(JSON.stringify(row)));

const result = nextGeneration(grid);
console.log("\nOUTPUT:");
result.forEach((row, i) => console.log(JSON.stringify(row)));

console.log("\nEXPECTED (per test):");
[
  [false, true, false],
  [true, true, true],
  [false, false, false],
].forEach((row, i) => console.log(JSON.stringify(row)));
