export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  return Array.from(neighborCounts)
    .filter(([key, count]) => count === 3 || (count === 2 && liveKeys.has(key)))
    .map(([key]) => fromKey(key));
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
