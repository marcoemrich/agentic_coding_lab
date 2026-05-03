export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [xs, ys] = k.split(',');
  return [Number(xs), Number(ys)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(living: ReadonlyArray<Cell>): Cell[] {
  const liveSet = new Set<string>();
  for (const [x, y] of living) {
    liveSet.add(key(x, y));
  }

  // Count live neighbors for every cell that is adjacent to (or is) a live cell.
  const neighborCounts = new Map<string, number>();
  for (const k of liveSet) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = liveSet.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      next.push(parseKey(k));
    } else if (!isAlive && count === 3) {
      next.push(parseKey(k));
    }
  }

  return next;
}
