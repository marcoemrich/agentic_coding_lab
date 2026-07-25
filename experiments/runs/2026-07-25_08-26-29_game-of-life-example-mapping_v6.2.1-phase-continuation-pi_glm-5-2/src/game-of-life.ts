export type Cell = [number, number];

const NEIGHBOR_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
] as const;

/** A live cell survives only if it has at least this many live neighbors. */
const MIN_NEIGHBORS_TO_SURVIVE = 2;
/** A live cell dies (overpopulation) if it has more than this many live neighbors. */
const MAX_NEIGHBORS_TO_SURVIVE = 3;
/** A dead cell is born only if it has exactly this many live neighbors. */
const EXACT_NEIGHBORS_FOR_BIRTH = 3;

const cellKey = (x: number, y: number): string => `${x},${y}`;

/** Inverse of `cellKey`: reconstruct a cell from its string key. */
const cellFromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

/**
 * Compute the next generation of live cells from the current set.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));

  // Single source of truth: for every cell adjacent to a live cell,
  // how many live neighbors it has.
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const survivors = cells.filter(([x, y]) => {
    const count = neighborCounts.get(cellKey(x, y)) ?? 0;
    return count >= MIN_NEIGHBORS_TO_SURVIVE && count <= MAX_NEIGHBORS_TO_SURVIVE;
  });

  const births: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === EXACT_NEIGHBORS_FOR_BIRTH && !liveCells.has(key)) {
      births.push(cellFromKey(key));
    }
  }
  return [...survivors, ...births];
}
