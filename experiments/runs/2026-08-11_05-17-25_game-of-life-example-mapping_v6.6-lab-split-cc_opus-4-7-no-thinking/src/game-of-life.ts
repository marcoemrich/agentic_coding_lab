export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const cellFromKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

const willBeAlive = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === BIRTH_NEIGHBOR_COUNT ||
  (isAlive && neighbors === SURVIVAL_NEIGHBOR_COUNT);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countNeighborContributions = (liveCells: Cell[]): Map<string, number> =>
  liveCells
    .flatMap(neighborsOf)
    .map(cellKey)
    .reduce(
      (counts, key) => counts.set(key, (counts.get(key) ?? 0) + 1),
      new Map<string, number>(),
    );

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = countNeighborContributions(liveCells);

  return [...neighborCounts]
    .filter(([key, count]) => willBeAlive(aliveKeys.has(key), count))
    .map(([key]) => cellFromKey(key));
}
