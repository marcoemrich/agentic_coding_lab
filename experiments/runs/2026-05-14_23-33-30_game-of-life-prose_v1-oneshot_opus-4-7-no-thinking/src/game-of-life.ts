export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

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
  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      next.push(parseKey(k));
    } else if (!isAlive && count === 3) {
      next.push(parseKey(k));
    }
  }

  // Also include any live cells that have zero neighbors — they will die,
  // but ensure we don't accidentally miss live cells that had count entries.
  // (Live cells with 0 neighbors die anyway, so nothing to add.)

  return next;
}
