export type Cell = readonly [number, number];

const BIRTH_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; count: number };

const tallyNeighbors = (liveCells: readonly Cell[]): Map<string, NeighborTally> => {
  const tally = new Map<string, NeighborTally>();
  for (const neighbor of liveCells.flatMap(neighborsOf)) {
    const key = cellKey(neighbor);
    const entry = tally.get(key) ?? { cell: neighbor, count: 0 };
    entry.count++;
    tally.set(key, entry);
  }
  return tally;
};

const isAliveNextGen = (count: number, wasAlive: boolean): boolean =>
  count === BIRTH_NEIGHBORS || (count === SURVIVAL_NEIGHBORS && wasAlive);

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const isAlive = new Set(liveCells.map(cellKey));
  return [...tallyNeighbors(liveCells)]
    .filter(([key, { count }]) => isAliveNextGen(count, isAlive.has(key)))
    .map(([, { cell }]) => cell);
}
