export type Cell = [number, number];

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

const isAliveNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

const occupiedPositions = (cells: Cell[]): Set<string> =>
  new Set(cells.map(cellKey));

const uniqueByPosition = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const living = occupiedPositions(liveCells);
  const isAliveNow = (cell: Cell): boolean => living.has(cellKey(cell));
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAliveNow).length;

  const cellsToEvaluate = uniqueByPosition(
    liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]),
  );

  return cellsToEvaluate.filter((cell) =>
    isAliveNextGeneration(isAliveNow(cell), liveNeighborCount(cell)),
  );
};
