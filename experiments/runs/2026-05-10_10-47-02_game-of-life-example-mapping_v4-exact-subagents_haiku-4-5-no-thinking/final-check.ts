import { nextGeneration } from "./src/game-of-life.js";

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

const result = nextGeneration(grid);

console.log("Input center cell (1,1):", grid[1][1]);
console.log("Output center cell (1,1):", result[1][1]);
console.log("Center cell became alive:", !grid[1][1] && result[1][1]);

if (!grid[1][1] && result[1][1]) {
  console.log("\nSUCCESS: Dead cell with 3 neighbors became alive!");
} else {
  console.log("\nFAILED: Dead cell with 3 neighbors is still dead.");
}
