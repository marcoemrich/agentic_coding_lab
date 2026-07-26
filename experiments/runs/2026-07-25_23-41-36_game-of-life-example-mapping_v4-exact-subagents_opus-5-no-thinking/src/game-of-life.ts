export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const countLiveNeighbors = (cell: Cell, liveKeys: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveKeys.has(cellKey(neighbor))).length;

const isAliveNextGeneration = (cell: Cell, liveKeys: Set<string>): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveKeys);
  return liveNeighbors === 3 || (liveNeighbors === 2 && liveKeys.has(cellKey(cell)));
};

const distinctCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

const candidateCells = (liveCells: Cell[]): Cell[] =>
  distinctCells([...liveCells, ...liveCells.flatMap(neighborsOf)]);

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  return candidateCells(liveCells).filter((cell) => isAliveNextGeneration(cell, liveKeys));
};
