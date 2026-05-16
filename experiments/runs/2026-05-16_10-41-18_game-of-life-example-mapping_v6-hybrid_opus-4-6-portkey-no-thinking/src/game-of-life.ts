type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
  return counts;
};

const shouldLive = (count: number, isAlive: boolean): boolean =>
  count === 3 || (count === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  return [...neighborCounts.entries()]
    .filter(([key, count]) => shouldLive(count, alive.has(key)))
    .map(([key]) => fromKey(key));
}
