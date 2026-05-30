export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const REPRODUCTION_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;

const isAliveNextGen = (isLive: boolean, neighborCount: number): boolean =>
  neighborCount === REPRODUCTION_NEIGHBORS ||
  (isLive && neighborCount === SURVIVAL_NEIGHBORS);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type Tally = { cell: Cell; count: number; isLive: boolean };

const tallyNeighborCounts = (liveCells: Cell[]): Tally[] => {
  const liveKeys = new Set(liveCells.map(keyOf));
  const tallies = new Map<string, Tally>();
  for (const neighbor of liveCells.flatMap(neighborsOf)) {
    const key = keyOf(neighbor);
    const tally = tallies.get(key)
      ?? { cell: neighbor, count: 0, isLive: liveKeys.has(key) };
    tallies.set(key, { ...tally, count: tally.count + 1 });
  }
  return [...tallies.values()];
};

export const nextGeneration = (liveCells: Cell[]): Cell[] =>
  tallyNeighborCounts(liveCells)
    .filter(({ isLive, count }) => isAliveNextGen(isLive, count))
    .map(({ cell }) => cell);
