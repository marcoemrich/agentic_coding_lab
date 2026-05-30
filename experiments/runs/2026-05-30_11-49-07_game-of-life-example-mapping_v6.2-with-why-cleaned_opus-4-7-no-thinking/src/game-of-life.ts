export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const isAliveNextGeneration = (neighborCount: number, isCurrentlyAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);

const countLiveNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  return Array.from(neighborCounts)
    .filter(([key, count]) => isAliveNextGeneration(count, alive.has(key)))
    .map(([key]) => fromKey(key));
}
