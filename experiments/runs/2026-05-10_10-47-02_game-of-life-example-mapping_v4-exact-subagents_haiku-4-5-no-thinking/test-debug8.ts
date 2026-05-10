import type { Grid } from "./src/game-of-life.js";

const countNeighbors = (grid: Grid, row: number, col: number): number => {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      const skip = r === row && c === col;
      const inBounds = r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
      const isAlive = inBounds && grid[r][c];
      console.log(`  (${r},${c}): skip=${skip}, inBounds=${inBounds}, alive=${isAlive}, value=${inBounds ? grid[r][c] : 'OOB'}`);
      if (!skip && isAlive) {
        count++;
      }
    }
  }
  return count;
};

const grid = [
  [false, true, false],
  [true, false, true],
  [false, false, false],
];

console.log("Grid:");
grid.forEach((row, i) => {
  const cells = row.map((cell, j) => `(${i},${j})=${cell ? 'T' : 'F'}`).join(', ');
  console.log(cells);
});

console.log("\nChecking neighbors of (1,0):");
const count10 = countNeighbors(grid, 1, 0);
console.log(`Total: ${count10}\n`);
