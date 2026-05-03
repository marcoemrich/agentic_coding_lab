export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(livingCells: readonly Cell[]): Cell[] {
  // Build a set of currently living cells (deduplicated).
  const living = new Set<string>();
  for (const [x, y] of livingCells) {
    living.add(key(x, y));
  }

  // Count live neighbors for every cell that could possibly be relevant:
  // every neighbor of a living cell.
  const neighborCounts = new Map<string, number>();
  for (const livingKey of living) {
    const [x, y] = parseKey(livingKey);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nKey = key(x + dx, y + dy);
        neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [cellKey, count] of neighborCounts) {
    const isAlive = living.has(cellKey);
    // Living cell: survives with 2 or 3 neighbors.
    // Dead cell: becomes alive with exactly 3 neighbors.
    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      next.push(parseKey(cellKey));
    }
  }

  return next;
}
