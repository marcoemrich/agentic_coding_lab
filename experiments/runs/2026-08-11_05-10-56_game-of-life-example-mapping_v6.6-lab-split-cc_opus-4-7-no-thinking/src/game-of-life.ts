export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const MIN_SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNTS: ReadonlySet<number> = new Set([
  MIN_SURVIVAL_NEIGHBORS,
  BIRTH_NEIGHBOR_COUNT,
]);

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesWithNeighborCount = (count: number): boolean =>
  SURVIVAL_NEIGHBOR_COUNTS.has(count);

const isBornWithNeighborCount = (count: number): boolean =>
  count === BIRTH_NEIGHBOR_COUNT;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((c) => [cellKey(c), c])).values()];

const cellsToEvaluate = (aliveCells: Cell[]): Cell[] =>
  uniqueCells([...aliveCells, ...aliveCells.flatMap(neighborsOf)]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(cellKey(cell));
  const aliveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;
  const willBeAlive = (cell: Cell): boolean => {
    const count = aliveNeighborCount(cell);
    return isAlive(cell)
      ? survivesWithNeighborCount(count)
      : isBornWithNeighborCount(count);
  };

  return cellsToEvaluate(cells).filter(willBeAlive);
}
