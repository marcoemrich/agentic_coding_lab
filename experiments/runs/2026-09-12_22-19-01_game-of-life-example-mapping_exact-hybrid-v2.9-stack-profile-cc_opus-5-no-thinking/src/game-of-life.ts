export type Cell = [number, number]; // [x, y]

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const deduplicate = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [key(cell), cell])).values(),
];

// On an infinite grid only living cells and their neighbours can change state,
// so these are the only cells worth evaluating.
const cellsThatCouldChange = (cells: Cell[]): Cell[] =>
  deduplicate(cells.flatMap((cell) => [cell, ...neighboursOf(cell)]));

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const living = new Set(cells.map(key));

  const liveNeighbourCount = (cell: Cell): number =>
    neighboursOf(cell).filter((neighbour) => living.has(key(neighbour))).length;

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const count = liveNeighbourCount(cell);
    return living.has(key(cell)) ? count === 2 || count === 3 : count === 3;
  };

  return cellsThatCouldChange(cells).filter(isAliveNextGeneration);
};
