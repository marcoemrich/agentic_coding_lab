const countLiveNeighbors = (grid: boolean[][], row: number, col: number): number => {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const neighborRow = row + dr;
      const neighborCol = col + dc;
      if (neighborRow >= 0 && neighborRow < grid.length && neighborCol >= 0 && neighborCol < grid[neighborRow].length && grid[neighborRow][neighborCol]) {
        count++;
      }
    }
  }
  return count;
};

const cellNextState = (cell: boolean, neighbors: number): boolean =>
  cell ? neighbors === 2 || neighbors === 3 : neighbors === 3;

export function nextGeneration(grid: boolean[][]): boolean[][] {
  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => cellNextState(cell, countLiveNeighbors(grid, rowIndex, colIndex)))
  );
}
