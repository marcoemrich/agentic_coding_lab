export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count live neighbors for every cell that is adjacent to (or is) a live cell.
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];

  // Apply rules:
  // - Dead cell with exactly 3 live neighbors becomes alive.
  // - Live cell with 2 or 3 live neighbors stays alive.
  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      const [xs, ys] = k.split(",");
      next.push([Number(xs), Number(ys)]);
    }
  }

  return next;
}
