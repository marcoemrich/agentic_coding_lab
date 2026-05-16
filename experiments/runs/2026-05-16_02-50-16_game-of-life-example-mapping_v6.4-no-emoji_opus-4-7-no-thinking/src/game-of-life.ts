export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveCells: ReadonlySet<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveCells.has(cellKey(neighbor))).length;

const isAliveNextGeneration = (
  cell: Cell,
  isCurrentlyAlive: boolean,
  liveCells: ReadonlySet<string>,
): boolean => {
  const neighborCount = countLiveNeighbors(cell, liveCells);
  return isCurrentlyAlive
    ? neighborCount === 2 || neighborCount === 3
    : neighborCount === 3;
};

const candidateCells = (cells: Cell[]): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of [cell, ...neighborsOf(cell)]) {
      candidates.set(cellKey(candidate), candidate);
    }
  }
  return candidates;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(cellKey));
  return Array.from(candidateCells(cells))
    .filter(([key, cell]) => isAliveNextGeneration(cell, liveCells.has(key), liveCells))
    .map(([, cell]) => cell);
};
