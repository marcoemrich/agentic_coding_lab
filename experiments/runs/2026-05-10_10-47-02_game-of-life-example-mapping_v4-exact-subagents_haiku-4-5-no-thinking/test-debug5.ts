import type { Grid } from "./src/game-of-life.js";

const countNeighbors = (grid: Grid, row: number, col: number): number => {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c]) {
        count++;
        console.log(`    Found neighbor at (${r},${c})`);
      }
    }
  }
  return count;
};

const grid = [
  [false, true, false],
  [true, true, false],
  [false, false, false],
];

console.log("Checking (0,0):");
const count00 = countNeighbors(grid, 0, 0);
console.log(`Total: ${count00}\n`);

console.log("Checking (0,1):");
const count01 = countNeighbors(grid, 0, 1);
console.log(`Total: ${count01}\n`);

console.log("Checking (1,0):");
const count10 = countNeighbors(grid, 1, 0);
console.log(`Total: ${count10}\n`);

console.log("Checking (1,1):");
const count11 = countNeighbors(grid, 1, 1);
console.log(`Total: ${count11}\n`);
