export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count neighbors for every cell that could be relevant:
  // every live cell and every neighbor of every live cell.
  const neighborCounts = new Map<string, number>();

  const offsets: Array<[number, number]> = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1],
  ];

  for (const k of live) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of offsets) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];

  // Any cell with neighbor counts could become alive (Rule 4) or stay (Rule 2).
  for (const [k, count] of neighborCounts) {
    if (live.has(k)) {
      // Live cell: survives with 2 or 3 neighbors
      if (count === 2 || count === 3) {
        next.push(parseKey(k));
      }
    } else {
      // Dead cell: born with exactly 3 neighbors
      if (count === 3) {
        next.push(parseKey(k));
      }
    }
  }

  // Live cells with 0 neighbors aren't in neighborCounts; they die anyway.
  return next;
}
