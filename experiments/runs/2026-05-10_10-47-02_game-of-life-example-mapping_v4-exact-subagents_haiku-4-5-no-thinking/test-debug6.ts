import type { Grid } from "./src/game-of-life.js";

const countNeighbors = (grid: Grid, row: number, col: number): number => {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c]) {
        count++;
      }
    }
  }
  return count;
};

const willSurviveToNextGeneration = (isAlive: boolean, neighbors: number): boolean => {
  if (isAlive && neighbors < 2) {
    return false;
  }
  if (isAlive && neighbors > 3) {
    return false;
  }
  if (isAlive && (neighbors === 2 || neighbors === 3)) {
    return true;
  }
  if (!isAlive && neighbors === 3) {
    return true;
  }
  return isAlive;
};

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

console.log("Checking (1,0) - should be true:");
const count10 = countNeighbors(grid, 1, 0);
console.log(`Neighbors: ${count10}`);
const result10 = willSurviveToNextGeneration(grid[1][0], count10);
console.log(`Result: ${result10}`);

console.log("\nChecking (1,1) - should be true:");
const count11 = countNeighbors(grid, 1, 1);
console.log(`Neighbors: ${count11}`);
const result11 = willSurviveToNextGeneration(grid[1][1], count11);
console.log(`Result: ${result11}`);

console.log("\nChecking (1,2) - should be true:");
const count12 = countNeighbors(grid, 1, 2);
console.log(`Neighbors: ${count12}`);
const result12 = willSurviveToNextGeneration(grid[1][2], count12);
console.log(`Result: ${result12}`);
