export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      const [xs, ys] = k.split(",");
      next.push([Number(xs), Number(ys)]);
    }
  }

  return next;
}
