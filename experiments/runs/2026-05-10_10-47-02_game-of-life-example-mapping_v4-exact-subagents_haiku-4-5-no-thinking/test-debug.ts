import { nextGeneration } from "./src/game-of-life.js";

const grid = [
  [false, false, false],
  [true, true, true],
  [false, false, false],
];

console.log("Input grid:");
grid.forEach((row, i) => console.log(i, row));

const result = nextGeneration(grid);
console.log("\nOutput grid:");
result.forEach((row, i) => console.log(i, row));

console.log("\nExpected:");
[
  [false, true, false],
  [false, true, false],
  [false, true, false],
].forEach((row, i) => console.log(i, row));
