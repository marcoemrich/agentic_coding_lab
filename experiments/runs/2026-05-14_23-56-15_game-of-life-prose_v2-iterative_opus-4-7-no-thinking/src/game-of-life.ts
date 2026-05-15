export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [xs, ys] = k.split(",");
  return [Number(xs), Number(ys)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count live neighbors for every cell adjacent to a living cell
  const neighborCounts = new Map<string, number>();

  for (const cellKey of live) {
    const [x, y] = parseKey(cellKey);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const alive = live.has(k);
    if (alive && (count === 2 || count === 3)) {
      next.push(parseKey(k));
    } else if (!alive && count === 3) {
      next.push(parseKey(k));
    }
  }

  return next;
}
