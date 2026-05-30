export type Cell = readonly [x: number, y: number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const livesNextGeneration = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === NEIGHBORS_FOR_BIRTH || (isAlive && neighborCount === NEIGHBORS_FOR_SURVIVAL);

type NeighborEntry = { cell: Cell; neighborCount: number };

const countNeighbors = (cells: readonly Cell[]): Map<string, NeighborEntry> => {
  const entries = new Map<string, NeighborEntry>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const entry = entries.get(key);
      if (entry) entry.neighborCount++;
      else entries.set(key, { cell, neighborCount: 1 });
    }
  }
  return entries;
};

export const nextGeneration = (cells: readonly Cell[]): readonly Cell[] => {
  const aliveKeys = new Set(cells.map(toKey));
  const result: Cell[] = [];
  for (const [key, { cell, neighborCount }] of countNeighbors(cells)) {
    if (livesNextGeneration(aliveKeys.has(key), neighborCount)) result.push(cell);
  }
  return result;
};
