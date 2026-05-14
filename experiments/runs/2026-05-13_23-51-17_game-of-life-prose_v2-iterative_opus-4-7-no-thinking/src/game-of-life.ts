export type Cell = readonly [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

/**
 * Compute the next generation of Conway's Game of Life on an infinite grid.
 * Only living cells are tracked (sparse representation).
 */
export function nextGeneration(living: Iterable<Cell>): Cell[] {
  const liveKeys = new Set<string>();
  for (const [x, y] of living) {
    liveKeys.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();
  for (const k of liveKeys) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = liveKeys.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      result.push(parseKey(k));
    }
  }
  return result;
}
