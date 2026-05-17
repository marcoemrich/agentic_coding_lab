export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  cells.forEach((cell) => seen.set(cellKey(cell), cell));
  return [...seen.values()];
};

const candidateCells = (liveCells: Cell[]): Cell[] =>
  uniqueCells(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

const liveNeighborCount = (cell: Cell, liveSet: Set<string>): number =>
  neighborsOf(cell).filter((n) => liveSet.has(cellKey(n))).length;

const survivesNextGeneration = (cell: Cell, liveSet: Set<string>): boolean => {
  const count = liveNeighborCount(cell, liveSet);
  return liveSet.has(cellKey(cell)) ? count === 2 || count === 3 : count === 3;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((cell) =>
    survivesNextGeneration(cell, liveSet)
  );
};
