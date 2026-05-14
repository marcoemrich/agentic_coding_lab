export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [xs, ys] = k.split(',');
  return [Number(xs), Number(ys)];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count live neighbors for every cell that is adjacent to a living cell.
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const next = new Set<string>();

  // Living cells with 2 or 3 live neighbors stay alive.
  for (const k of alive) {
    const count = neighborCounts.get(k) ?? 0;
    if (count === 2 || count === 3) {
      next.add(k);
    }
  }

  // Dead cells with exactly 3 live neighbors come alive.
  for (const [k, count] of neighborCounts) {
    if (count === 3 && !alive.has(k)) {
      next.add(k);
    }
  }

  return Array.from(next, parseKey);
}
