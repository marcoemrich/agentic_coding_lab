export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNextGeneration = (
  neighborCount: number,
  wasAlive: boolean,
): boolean => neighborCount === 3 || (wasAlive && neighborCount === 2);

type CandidateCounts = Map<string, { cell: Cell; count: number }>;

const countLiveNeighbors = (cells: Cell[]): CandidateCounts => {
  const counts: CandidateCounts = new Map();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(cellKey));
  return Array.from(countLiveNeighbors(cells))
    .filter(([key, { count }]) => isAliveNextGeneration(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
};
