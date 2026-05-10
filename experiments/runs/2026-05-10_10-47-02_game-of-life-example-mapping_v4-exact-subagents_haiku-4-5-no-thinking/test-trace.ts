import type { Grid } from "./src/game-of-life.js";

// Copy the exact code from game-of-life.ts
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
  console.log(`  willSurvive(isAlive=${isAlive}, neighbors=${neighbors})`);
  if (isAlive && neighbors < 2) {
    console.log(`    -> false (underpop)`);
    return false;
  }
  if (isAlive && neighbors > 3) {
    console.log(`    -> false (overpop)`);
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
  console.log(`    -> ${isAlive} (default)`);
  return isAlive;
};

const nextGeneration = (grid: Grid): Grid => {
  if (grid.length === 0) {
    return [];
  }

  return grid.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      const neighbors = countNeighbors(grid, rowIdx, colIdx);
      console.log(`(${rowIdx},${colIdx}): cell=${cell}, neighbors=${neighbors}`);
      return willSurviveToNextGeneration(cell, neighbors);
    })
  );
};

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

const result = nextGeneration(grid);
console.log("\nResult:");
result.forEach((row, i) => console.log(JSON.stringify(row)));
