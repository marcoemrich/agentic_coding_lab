type Grid = number[][];

const isLiveCell = (cell: number): boolean => cell === 1;

const countNeighbors = (grid: Grid, row: number, col: number): number => {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
        count += grid[r][c];
      }
    }
  }
  return count;
};

const nextCellState = (grid: Grid, cell: number, row: number, col: number): number => {
  const neighbors = countNeighbors(grid, row, col);
  const alive = isLiveCell(cell);
  const survives = alive && (neighbors === 2 || neighbors === 3);
  const isReborn = !alive && neighbors === 3;
  return survives || isReborn ? 1 : 0;
};

const padGrid = (grid: Grid): Grid => {
  const cols = grid[0]?.length ?? 0;
  const emptyRow = Array(cols + 2).fill(0);
  const paddedRows = grid.map(row => [0, ...row, 0]);
  return [emptyRow, ...paddedRows, emptyRow];
};

const trimGrid = (grid: Grid): Grid => {
  const liveRows = grid.filter(row => row.some(isLiveCell));
  if (liveRows.length === 0) return [];
  const liveCols = liveRows.flatMap(row =>
    row.map((cell, c) => (isLiveCell(cell) ? c : -1)).filter(c => c >= 0)
  );
  const minCol = Math.min(...liveCols);
  const maxCol = Math.max(...liveCols);
  return liveRows.map(row => row.slice(minCol, maxCol + 1));
};

export function nextGeneration(grid: Grid): Grid {
  if (grid.length === 0) return [];

  const padded = padGrid(grid);

  const nextGrid: Grid = padded.map((row, r) =>
    row.map((cell, c) => nextCellState(padded, cell, r, c))
  );

  return trimGrid(nextGrid);
}
