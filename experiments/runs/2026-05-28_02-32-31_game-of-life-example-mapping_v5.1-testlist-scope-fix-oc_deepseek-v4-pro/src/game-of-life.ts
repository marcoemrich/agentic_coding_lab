export type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [cx, cy] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(cx + dx, cy + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = liveSet.has(key);
    if (count === 3 || (isAlive && count === 2)) {
      result.push(fromKey(key));
    }
  }

  return result;
}