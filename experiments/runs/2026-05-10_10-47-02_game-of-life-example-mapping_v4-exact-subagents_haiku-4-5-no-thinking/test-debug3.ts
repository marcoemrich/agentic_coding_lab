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
  console.log(`  Checking: isAlive=${isAlive}, neighbors=${neighbors}`);
  if (isAlive && neighbors < 2) {
    console.log(`    -> false (underpopulation)`);
    return false;
  }
  if (isAlive && neighbors > 3) {
    console.log(`    -> false (overpopulation)`);
    return false;
  }
  if (isAlive && (neighbors === 2 || neighbors === 3)) {
    console.log(`    -> true (survival)`);
    return true;
  }
  if (!isAlive && neighbors === 3) {
    console.log(`    -> true (reproduction)`);
    return true;
  }
  console.log(`    -> false (default)`);
  return false;
};

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

console.log("Checking (1,1):");
const neighbors = countNeighbors(grid, 1, 1);
console.log(`Neighbors count: ${neighbors}`);
const result = willSurviveToNextGeneration(grid[1][1], neighbors);
console.log(`Result: ${result}`);
