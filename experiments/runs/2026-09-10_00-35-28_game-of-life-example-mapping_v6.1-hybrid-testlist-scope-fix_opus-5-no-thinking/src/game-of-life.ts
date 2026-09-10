export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = MAX_NEIGHBORS_TO_SURVIVE;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));

  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const candidates = uniqueCells(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

  const survivesToNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = liveNeighborCount(cell);
    return isAlive(cell)
      ? liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
          liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
      : liveNeighbors === NEIGHBORS_TO_BE_BORN;
  };

  return candidates.filter(survivesToNextGeneration);
}
