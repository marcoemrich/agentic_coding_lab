export type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;

const fromKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const alive = new Set(liveCells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === 3 || (alive.has(key) && count === 2))
    .map(([key]) => fromKey(key));
}
