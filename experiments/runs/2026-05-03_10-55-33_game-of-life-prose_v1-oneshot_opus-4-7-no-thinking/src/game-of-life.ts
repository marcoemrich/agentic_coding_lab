export type Cell = readonly [number, number];

export function nextGeneration(livingCells: Iterable<Cell>): Set<string> {
  const living = new Set<string>();
  for (const [x, y] of livingCells) {
    living.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();

  for (const cellKey of living) {
    const [x, y] = parseKey(cellKey);
    for (const [nx, ny] of neighbors(x, y)) {
      const k = key(nx, ny);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [cellKey, count] of neighborCounts) {
    if (count === 3 || (count === 2 && living.has(cellKey))) {
      next.add(cellKey);
    }
  }

  return next;
}

export function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseKey(k: string): [number, number] {
  const idx = k.indexOf(',');
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}

function* neighbors(x: number, y: number): Generator<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      yield [x + dx, y + dy];
    }
  }
}
