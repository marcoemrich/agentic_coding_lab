export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const idx = k.indexOf(',');
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of livingCells) {
    alive.add(key(x, y));
  }

  // Count, for every cell that has at least one live neighbor,
  // how many live neighbors it has.
  const neighborCounts = new Map<string, number>();
  for (const k of alive) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      next.push(parseKey(k));
    }
  }
  return next;
}
