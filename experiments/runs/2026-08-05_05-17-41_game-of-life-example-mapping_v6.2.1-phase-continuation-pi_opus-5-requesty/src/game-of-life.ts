/** A living cell's position on the infinite grid, as [x, y]. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const cellsThatCouldChange = (liveCells: Cell[]): Cell[] => [
  ...new Map(
    liveCells
      .flatMap((cell) => [cell, ...neighborsOf(cell)])
      .map((cell) => [keyOf(cell), cell] as const),
  ).values(),
];

const isAliveNextGeneration = (
  isCurrentlyAlive: boolean,
  liveNeighborCount: number,
): boolean =>
  liveNeighborCount === 3 || (liveNeighborCount === 2 && isCurrentlyAlive);

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(keyOf));
  const isAlive = (cell: Cell): boolean => liveKeys.has(keyOf(cell));

  return cellsThatCouldChange(liveCells).filter((cell) =>
    isAliveNextGeneration(isAlive(cell), neighborsOf(cell).filter(isAlive).length),
  );
};
