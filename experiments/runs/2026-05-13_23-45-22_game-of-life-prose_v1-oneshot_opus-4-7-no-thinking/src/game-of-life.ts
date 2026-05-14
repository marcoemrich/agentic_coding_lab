export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function keyOf(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [xStr, yStr] = key.split(",");
  return [Number(xStr), Number(yStr)];
}

/**
 * Compute the next generation of Conway's Game of Life.
 *
 * Uses a sparse representation: only living cells are tracked. For each living
 * cell we increment a neighbor count for each of its eight surrounding cells.
 * After tallying, a cell with exactly 3 neighbors is alive next generation
 * (birth or survival), and a currently alive cell with 2 neighbors survives.
 */
export function nextGeneration(living: Iterable<Cell>): Set<string> {
  const livingSet = new Set<string>();
  for (const [x, y] of living) {
    livingSet.add(keyOf(x, y));
  }

  const neighborCounts = new Map<string, number>();

  for (const cellKey of livingSet) {
    const [x, y] = parseKey(cellKey);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nKey = keyOf(x + dx, y + dy);
      neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && livingSet.has(key))) {
      next.add(key);
    }
  }
  return next;
}

/**
 * Convenience wrapper that returns the next generation as an array of [x, y]
 * tuples rather than the internal string-key set.
 */
export function nextGenerationCells(living: Iterable<Cell>): Cell[] {
  const result: Cell[] = [];
  for (const key of nextGeneration(living)) {
    result.push(parseKey(key));
  }
  return result;
}
