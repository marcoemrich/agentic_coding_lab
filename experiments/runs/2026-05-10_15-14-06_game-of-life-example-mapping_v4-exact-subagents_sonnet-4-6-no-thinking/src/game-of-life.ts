type BoundingBox = { minRow: number; maxRow: number; minCol: number; maxCol: number } | null;

const willLive = (alive: boolean, neighbors: number): boolean =>
  alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;

const findLiveCellBounds = (grid: boolean[][]): BoundingBox => {
  let minRow = grid.length, maxRow = -1, minCol = grid[0].length, maxCol = -1;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) {
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
      }
    }
  }
  return maxRow === -1 ? null : { minRow, maxRow, minCol, maxCol };
};

export function nextGeneration(grid: boolean[][]): boolean[][] {
  if (grid.length === 0) return [];

  const rows = grid.length;
  const cols = grid[0].length;

  const countNeighbors = (r: number, c: number): number => {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) {
          count++;
        }
      }
    }
    return count;
  };

  const next: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      const neighbors = countNeighbors(r, c);
      const alive = grid[r][c];
      row.push(willLive(alive, neighbors));
    }
    next.push(row);
  }

  const bounds = findLiveCellBounds(next);
  if (bounds === null) return [];

  const { minRow, maxRow, minCol, maxCol } = bounds;
  const result: boolean[][] = [];
  for (let r = minRow; r <= maxRow; r++) {
    result.push(next[r].slice(minCol, maxCol + 1));
  }
  return result;
}
