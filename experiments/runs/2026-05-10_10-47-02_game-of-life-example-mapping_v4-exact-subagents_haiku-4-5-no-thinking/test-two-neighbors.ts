import { nextGeneration } from "./src/game-of-life.js";

const grid = [
  [false, false, false],
  [true, true, true],
  [false, false, false],
];

console.log("should keep live cell alive with 2 neighbors (survival)");
console.log("Input:");
grid.forEach((row, i) => console.log(i, row));

const result = nextGeneration(grid);
console.log("\nOutput:");
result.forEach((row, i) => console.log(i, row));

console.log("\nExpected:");
[
  [false, true, false],
  [false, true, false],
  [false, true, false],
].forEach((row, i) => console.log(i, row));

console.log("\nMatch:", JSON.stringify(result) === JSON.stringify([
  [false, true, false],
  [false, true, false],
  [false, true, false],
]));
