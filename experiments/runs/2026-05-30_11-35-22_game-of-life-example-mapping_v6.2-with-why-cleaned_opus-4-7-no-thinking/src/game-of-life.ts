export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; count: number };

const tallyNeighbors = (liveCells: Cell[]): NeighborTally[] => {
  const tallies = new Map<string, NeighborTally>();
  const recordNeighbor = (neighbor: Cell): void => {
    const key = cellKey(neighbor);
    const prior = tallies.get(key)?.count ?? 0;
    tallies.set(key, { cell: neighbor, count: prior + 1 });
  };
  liveCells.flatMap(neighborsOf).forEach(recordNeighbor);
  return [...tallies.values()];
};

const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));

  const livesInNextGeneration = ({ cell, count }: NeighborTally): boolean =>
    count === BIRTH_NEIGHBOR_COUNT ||
    (count === SURVIVAL_NEIGHBOR_COUNT && isAlive(cell));

  return tallyNeighbors(liveCells)
    .filter(livesInNextGeneration)
    .map(({ cell }) => cell);
};
