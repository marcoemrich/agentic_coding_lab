export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [xs, ys] = k.split(',');
  return [Number(xs), Number(ys)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count neighbors for every cell that has at least one live neighbor.
  const neighborCounts = new Map<string, number>();
  for (const k of live) {
    const [x, y] = parseKey(k);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  // Surviving live cells
  for (const k of live) {
    const count = neighborCounts.get(k) ?? 0;
    if (count === 2 || count === 3) {
      next.push(parseKey(k));
    }
  }
  // Newly born cells (dead cells with exactly 3 neighbors)
  for (const [k, count] of neighborCounts) {
    if (count === 3 && !live.has(k)) {
      next.push(parseKey(k));
    }
  }

  return next;
}
