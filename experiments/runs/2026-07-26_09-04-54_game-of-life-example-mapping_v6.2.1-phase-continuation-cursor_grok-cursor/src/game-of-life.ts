export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function shouldLive(isAlive: boolean, neighborCount: number): boolean {
  if (isAlive) {
    return neighborCount === 2 || neighborCount === 3;
  }
  return neighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = cellKey(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (shouldLive(live.has(k), count)) {
      const [xs, ys] = k.split(",");
      next.push([Number(xs), Number(ys)]);
    }
  }
  return next;
}
