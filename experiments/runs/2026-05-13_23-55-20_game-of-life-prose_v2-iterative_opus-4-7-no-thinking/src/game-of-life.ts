export type Cell = readonly [number, number];

const encode = (x: number, y: number): string => `${x},${y}`;

const decode = (key: string): Cell => {
  const idx = key.indexOf(",");
  return [Number(key.slice(0, idx)), Number(key.slice(idx + 1))];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

/**
 * Compute the next generation of Conway's Game of Life.
 *
 * Uses a sparse representation: only living cells are stored. The grid is
 * conceptually infinite, so coordinates may be any integer (negative or
 * positive).
 *
 * Rules:
 *  - A live cell with 2 or 3 live neighbors survives.
 *  - A dead cell with exactly 3 live neighbors becomes alive.
 *  - All other cells die or remain dead.
 */
export function nextGeneration(living: Iterable<Cell>): Set<string> {
  const liveSet = new Set<string>();
  for (const [x, y] of living) {
    liveSet.add(encode(x, y));
  }

  // Count live neighbors for every cell that has at least one live neighbor.
  const neighborCounts = new Map<string, number>();
  for (const key of liveSet) {
    const [x, y] = decode(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nKey = encode(x + dx, y + dy);
      neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [key, count] of neighborCounts) {
    if (count === 3) {
      // Reproduction (works for both dead and live cells).
      next.add(key);
    } else if (count === 2 && liveSet.has(key)) {
      // Survival.
      next.add(key);
    }
  }

  return next;
}

/**
 * Convenience wrapper returning an array of [x, y] cells.
 */
export function nextGenerationCells(living: Iterable<Cell>): Cell[] {
  const next = nextGeneration(living);
  const result: Cell[] = [];
  for (const key of next) {
    result.push(decode(key));
  }
  return result;
}
