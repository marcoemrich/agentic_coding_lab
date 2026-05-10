import { nextGeneration } from "./src/game-of-life.js";

const grid = [
  [false, true, false],
  [true, true, false],
  [false, false, false],
];

console.log("Input grid (should keep live cell with three neighbors):");
grid.forEach((row, i) => console.log(i, row));

const result = nextGeneration(grid);
console.log("\nOutput grid:");
result.forEach((row, i) => console.log(i, row));

console.log("\nExpected:");
[
  [false, true, false],
  [true, true, false],
  [false, false, false],
].forEach((row, i) => console.log(i, row));
