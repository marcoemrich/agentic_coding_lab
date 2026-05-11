export type Cell = [number, number];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const toKey = (x: number, y: number) => `${x},${y}`;
  const fromKey = (k: string): Cell =>
    k.split(",").map(Number) as [number, number];
  const aliveKeys = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = toKey(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const survives = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && aliveKeys.has(k));

  return Array.from(neighborCounts)
    .filter(([k, count]) => survives(k, count))
    .map(([k]) => fromKey(k));
};
