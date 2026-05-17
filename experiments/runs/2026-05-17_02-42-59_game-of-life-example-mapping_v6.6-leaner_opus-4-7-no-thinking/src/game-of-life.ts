export type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const survives = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isAlive && neighbors === 2);

const countNeighbors = (cells: Cell[]): Map<string, number> => {
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
  const liveKeys = new Set(cells.map(toKey));
  return Array.from(countNeighbors(cells))
    .filter(([key, count]) => survives(liveKeys.has(key), count))
    .map(([key]) => fromKey(key));
}
