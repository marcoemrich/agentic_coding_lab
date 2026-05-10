const countNeighbors = (grid: boolean[][], rows: number, cols: number, r: number, c: number): number => {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) count++;
    }
  }
  return count;
};

export function nextGeneration(grid: boolean[][]): boolean[][] {
  if (grid.length === 0) return [];
  const rows = grid.length;
  const cols = grid[0].length;
  const result: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      const neighbors = countNeighbors(grid, rows, cols, r, c);
      const alive = grid[r][c];
      const survives = alive && (neighbors === 2 || neighbors === 3);
      const isReborn = !alive && neighbors === 3;
      row.push(survives || isReborn);
    }
    result.push(row);
  }
  const hasLiveCell = result.some(row => row.some(cell => cell));
  return hasLiveCell ? result : [];
}
