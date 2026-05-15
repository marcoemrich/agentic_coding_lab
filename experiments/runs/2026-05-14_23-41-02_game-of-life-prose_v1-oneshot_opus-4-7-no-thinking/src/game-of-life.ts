export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set<string>();
  for (const [x, y] of cells) {
    living.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();
  const offsets: Array<[number, number]> = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [x, y] of cells) {
    for (const [dx, dy] of offsets) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = living.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      next.push(parseKey(k));
    }
  }

  return next;
}
