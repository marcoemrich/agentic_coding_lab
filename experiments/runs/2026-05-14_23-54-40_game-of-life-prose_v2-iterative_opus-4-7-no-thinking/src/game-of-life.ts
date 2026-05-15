export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count live neighbors for every cell that has at least one live neighbor.
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

  const next: Cell[] = [];

  // Dead cells with exactly 3 live neighbors become alive.
  // Live cells with 2 or 3 live neighbors survive.
  for (const [k, count] of neighborCounts) {
    if (count === 3) {
      next.push(parseKey(k));
    } else if (count === 2 && live.has(k)) {
      next.push(parseKey(k));
    }
  }

  return next;
}
