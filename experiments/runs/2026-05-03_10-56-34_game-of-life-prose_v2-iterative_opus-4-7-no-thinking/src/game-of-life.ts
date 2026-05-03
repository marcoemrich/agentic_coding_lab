export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [xStr, yStr] = k.split(',');
  return [Number(xStr), Number(yStr)];
}

export function nextGeneration(livingCells: readonly Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of livingCells) {
    alive.add(key(x, y));
  }

  // Count live neighbors for every cell that touches a living cell
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
    const isAlive = alive.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      next.push(parseKey(k));
    } else if (!isAlive && count === 3) {
      next.push(parseKey(k));
    }
  }

  return next;
}
