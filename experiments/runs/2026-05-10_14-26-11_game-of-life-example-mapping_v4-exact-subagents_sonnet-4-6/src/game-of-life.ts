const getCell = (grid: boolean[][], r: number, c: number): boolean => {
  if (r < 0 || r >= grid.length) return false;
  const row = grid[r];
  if (c < 0 || c >= row.length) return false;
  return row[c] === true;
};

const countNeighbors = (grid: boolean[][], r: number, c: number): number => {
  let neighbors = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (getCell(grid, r + dr, c + dc)) neighbors++;
    }
  }
  return neighbors;
};

const willBeAlive = (alive: boolean, neighbors: number): boolean =>
  alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;

export function nextGeneration(grid: boolean[][]): boolean[][] {
  if (grid.length === 0) return [];

  const maxCols = Math.max(...grid.map(row => row.length));
  const result: boolean[][] = [];

  for (let r = -1; r <= grid.length; r++) {
    const newRow: boolean[] = [];
    for (let c = -1; c <= maxCols; c++) {
      const alive = getCell(grid, r, c);
      const neighbors = countNeighbors(grid, r, c);
      if (willBeAlive(alive, neighbors)) {
        newRow.push(true);
      }
    }
    const isOriginalRow = r >= 0 && r < grid.length;
    if (newRow.length > 0 || isOriginalRow) {
      result.push(newRow);
    }
  }

  return result;
}
