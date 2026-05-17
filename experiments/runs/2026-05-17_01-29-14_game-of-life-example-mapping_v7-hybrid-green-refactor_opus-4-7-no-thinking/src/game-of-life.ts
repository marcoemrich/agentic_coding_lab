export type Cell = [number, number];

const isNeighbor = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  (ax !== bx || ay !== by) && Math.abs(ax - bx) <= 1 && Math.abs(ay - by) <= 1;

const liveNeighborCount = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((other) => isNeighbor(cell, other)).length;

const survives = (cell: Cell, liveCells: Cell[]): boolean => {
  const count = liveNeighborCount(cell, liveCells);
  return count === 2 || count === 3;
};

const isReborn = (cell: Cell, liveCells: Cell[]): boolean =>
  liveNeighborCount(cell, liveCells) === 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y    ],             [x + 1, y    ],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const uniqueByKey = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];

const deadNeighborsOf = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const candidates = liveCells.flatMap(neighborsOf);
  return uniqueByKey(candidates.filter((cell) => !liveKeys.has(cellKey(cell))));
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => [
  ...liveCells.filter((cell) => survives(cell, liveCells)),
  ...deadNeighborsOf(liveCells).filter((cell) => isReborn(cell, liveCells)),
];
