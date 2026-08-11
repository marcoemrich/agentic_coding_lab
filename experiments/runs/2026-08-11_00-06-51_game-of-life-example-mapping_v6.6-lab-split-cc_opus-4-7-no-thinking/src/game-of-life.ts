export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const REPRODUCTION_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveNextGeneration = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === REPRODUCTION_NEIGHBORS ||
  (isAlive && neighbors === SURVIVAL_NEIGHBORS);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; count: number };

const allNeighbors = (cells: Cell[]): Cell[] =>
  cells.flatMap(neighborsOf);

const tallyByKey = (neighbors: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const cell of neighbors) {
    const key = cellKey(cell);
    const count = (tallies.get(key)?.count ?? 0) + 1;
    tallies.set(key, { cell, count });
  }
  return tallies;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  return Array.from(tallyByKey(allNeighbors(cells)))
    .filter(([key, { count }]) => isAliveNextGeneration(alive.has(key), count))
    .map(([, { cell }]) => cell);
}
