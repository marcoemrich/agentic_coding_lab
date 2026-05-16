export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const sameCell = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  ax === bx && ay === by;

const includesCell = (cells: Cell[], target: Cell): boolean =>
  cells.some((cell) => sameCell(cell, target));

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const livingNeighborCount = (cell: Cell, livingCells: Cell[]): number =>
  neighborsOf(cell).filter((n) => includesCell(livingCells, n)).length;

const livesNextGeneration = (cell: Cell, livingCells: Cell[]): boolean => {
  const count = livingNeighborCount(cell, livingCells);
  return count === 3 || (count === 2 && includesCell(livingCells, cell));
};

const uniqueCells = (cells: Cell[]): Cell[] => {
  const result: Cell[] = [];
  for (const cell of cells) {
    if (!includesCell(result, cell)) result.push(cell);
  }
  return result;
};

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const candidates = uniqueCells([...livingCells, ...livingCells.flatMap(neighborsOf)]);
  return candidates.filter((cell) => livesNextGeneration(cell, livingCells));
};
