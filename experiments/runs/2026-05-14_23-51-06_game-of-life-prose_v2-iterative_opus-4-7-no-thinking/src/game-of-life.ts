export type Cell = [number, number];

function keyOf(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const idx = key.indexOf(",");
  const x = Number(key.slice(0, idx));
  const y = Number(key.slice(idx + 1));
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(keyOf(x, y));
  }

  // Count neighbors for every cell adjacent to a living cell
  const neighborCounts = new Map<string, number>();
  const offsets: Array<[number, number]> = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [x, y] of cells) {
    for (const [dx, dy] of offsets) {
      const nx = x + dx;
      const ny = y + dy;
      const k = keyOf(nx, ny);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = alive.has(key);
    if (count === 3 || (count === 2 && isAlive)) {
      next.push(parseKey(key));
    }
  }

  return next;
}
