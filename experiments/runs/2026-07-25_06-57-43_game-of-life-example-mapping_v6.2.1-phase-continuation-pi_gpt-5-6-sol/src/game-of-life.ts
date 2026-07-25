export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const key = cellKey(...cell);
        const candidate = neighborCounts.get(key);
        neighborCounts.set(key, { cell, count: (candidate?.count ?? 0) + 1 });
      }
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
