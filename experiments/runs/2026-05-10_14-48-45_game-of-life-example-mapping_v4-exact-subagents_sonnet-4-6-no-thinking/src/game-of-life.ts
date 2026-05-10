const isWithinGrid = (grid: boolean[][], row: number, col: number): boolean =>
  row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;

const countNeighbors = (grid: boolean[][], row: number, col: number): number => {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (isWithinGrid(grid, r, c) && grid[r][c]) count++;
    }
  }
  return count;
};

const willBeAlive = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export function nextGeneration(grid: boolean[][]): boolean[][] {
  if (grid.length === 1 && grid[0].length === 1) return [[]];
  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) =>
      willBeAlive(cell, countNeighbors(grid, rowIndex, colIndex))
    )
  );
}
