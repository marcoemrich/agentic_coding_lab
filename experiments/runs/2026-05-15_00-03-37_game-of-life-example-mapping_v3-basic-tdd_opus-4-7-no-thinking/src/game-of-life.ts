export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count live neighbors for every cell that is adjacent to (or is) a live cell.
  const neighborCounts = new Map<string, { x: number; y: number; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        const entry = neighborCounts.get(k);
        if (entry) {
          entry.count++;
        } else {
          neighborCounts.set(k, { x: nx, y: ny, count: 1 });
        }
      }
    }
  }

  const next: Cell[] = [];
  for (const { x, y, count } of neighborCounts.values()) {
    const isAlive = alive.has(key(x, y));
    if (isAlive && (count === 2 || count === 3)) {
      next.push([x, y]);
    } else if (!isAlive && count === 3) {
      next.push([x, y]);
    }
  }

  // Live cells with zero neighbors aren't in neighborCounts; they die anyway,
  // so we don't need to handle them.

  return next;
}
