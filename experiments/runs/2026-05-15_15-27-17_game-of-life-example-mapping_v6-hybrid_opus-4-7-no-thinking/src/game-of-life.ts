export type Cell = [number, number];

const areNeighbors = (a: Cell, b: Cell): boolean => {
  const dx = Math.abs(a[0] - b[0]);
  const dy = Math.abs(a[1] - b[1]);
  return (dx <= 1 && dy <= 1) && (dx !== 0 || dy !== 0);
};

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => areNeighbors(cell, other)).length;

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const candidateCells = (cells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const candidate: Cell = [x + dx, y + dy];
        seen.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...seen.values()];
};

const isAlive = (cell: Cell, cells: Cell[]): boolean =>
  cells.some((c) => c[0] === cell[0] && c[1] === cell[1]);

const isAliveNextGeneration = (cell: Cell, cells: Cell[]): boolean => {
  const neighbors = countLiveNeighbors(cell, cells);
  return isAlive(cell, cells)
    ? neighbors === 2 || neighbors === 3
    : neighbors === 3;
};

export const nextGeneration = (cells: Cell[]): Cell[] =>
  candidateCells(cells).filter((cell) => isAliveNextGeneration(cell, cells));
