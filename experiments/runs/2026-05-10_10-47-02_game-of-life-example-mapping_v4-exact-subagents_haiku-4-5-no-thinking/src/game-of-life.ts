export type Cell = boolean;
export type Grid = Cell[][];

const SURVIVAL_NEIGHBORS = [2, 3];
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

const isWithinBounds = (row: number, col: number, maxRows: number, maxCols: number): boolean =>
  row >= 0 && row < maxRows && col >= 0 && col < maxCols;

const countAliveNeighbors = (isAlive: (r: number, c: number) => boolean): number => {
  let count = 0;
  for (const [dr, dc] of NEIGHBOR_OFFSETS) {
    if (isAlive(dr, dc)) {
      count++;
    }
  }
  return count;
};

const countNeighbors = (grid: Grid, row: number, col: number): number => {
  if (grid.length === 0) {
    return 0;
  }
  const rows = grid.length;
  const cols = grid[0].length;
  return countAliveNeighbors((dr, dc) => {
    const r = row + dr;
    const c = col + dc;
    return isWithinBounds(r, c, rows, cols) && grid[r][c];
  });
};

const shouldCellBeAlive = (isAlive: boolean, neighbors: number): boolean =>
  (isAlive && SURVIVAL_NEIGHBORS.includes(neighbors)) ||
  (!isAlive && neighbors === REPRODUCTION_NEIGHBORS);

const countNeighborsSparse = (
  grid: Map<string, boolean>,
  row: number,
  col: number
): number => {
  return countAliveNeighbors((dr, dc) => {
    const key = `${row + dr},${col + dc}`;
    return grid.get(key) ?? false;
  });
};

export const nextGeneration = (grid: Grid): Grid => {
  if (grid.length === 0) {
    return [];
  }

  return grid.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      const neighbors = countNeighbors(grid, rowIdx, colIdx);
      return shouldCellBeAlive(cell, neighbors);
    })
  );
};

export const nextGenerationSparse = (
  grid: Map<string, boolean>
): Map<string, boolean> => {
  const result = new Map<string, boolean>();

  for (const [key] of grid) {
    const [row, col] = key.split(",").map(Number);
    const isAlive = grid.get(key) || false;
    const neighbors = countNeighborsSparse(grid, row, col);
    result.set(key, shouldCellBeAlive(isAlive, neighbors));
  }

  return result;
};
