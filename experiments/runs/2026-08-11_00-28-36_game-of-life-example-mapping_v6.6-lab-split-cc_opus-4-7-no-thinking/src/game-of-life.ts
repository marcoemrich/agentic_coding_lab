export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveNextGeneration = (neighborCount: number, isCurrentlyAlive: boolean): boolean =>
  neighborCount === NEIGHBORS_FOR_BIRTH ||
  (neighborCount === NEIGHBORS_FOR_SURVIVAL && isCurrentlyAlive);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const aliveKeys = new Set(livingCells.map(toKey));
  const neighborCounts = countNeighbors(livingCells);

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => isAliveNextGeneration(count, aliveKeys.has(key)))
    .map(([, { cell }]) => cell);
}

type NeighborEntry = { cell: Cell; count: number };

function countNeighbors(livingCells: Cell[]): Map<string, NeighborEntry> {
  const counts = new Map<string, NeighborEntry>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      recordNeighbor(counts, [x + dx, y + dy]);
    }
  }
  return counts;
}

function recordNeighbor(counts: Map<string, NeighborEntry>, cell: Cell): void {
  const key = toKey(cell);
  const previous = counts.get(key)?.count ?? 0;
  counts.set(key, { cell, count: previous + 1 });
}
