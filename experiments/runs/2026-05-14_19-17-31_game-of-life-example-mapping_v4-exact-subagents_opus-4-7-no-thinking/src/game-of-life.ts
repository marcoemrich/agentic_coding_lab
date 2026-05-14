type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;
const parseKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const survivesOrIsBorn = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  return Array.from(neighborCounts)
    .filter(([key, count]) => survivesOrIsBorn(liveSet.has(key), count))
    .map(([key]) => parseKey(key));
};
