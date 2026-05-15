export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueByKey = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [keyOf(cell), cell])).values()];

const cellsToConsider = (aliveCells: Cell[]): Cell[] =>
  uniqueByKey(aliveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(keyOf));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(keyOf(cell));

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const livesNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = countLiveNeighbors(cell);
    return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell));
  };

  return cellsToConsider(cells).filter(livesNextGeneration);
};
