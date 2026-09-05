/** A live cell's position on an unbounded grid, as `[x, y]`. */
export type Cell = [number, number];

/**
 * The grid is unbounded and sparse, so cells are identified by a string key
 * rather than by array indices. `toKey`/`toCell` are exact inverses, which
 * lets a key serve as the single representation of a position.
 */
const toKey = ([x, y]: Cell): string => `${x},${y}`;

const toCell = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const OFFSETS = [-1, 0, 1];

/** A cell with exactly this many live neighbors is alive next generation. */
const NEIGHBORS_TO_BE_BORN = 3;

/** A *live* cell with exactly this many live neighbors survives. */
const NEIGHBORS_TO_SURVIVE = 2;

const neighborKeysOf = ([x, y]: Cell): string[] =>
  OFFSETS.flatMap((dx) =>
    OFFSETS
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy) => toKey([x + dx, y + dy])),
  );

/**
 * Counts, for every cell adjacent to at least one live cell, how many live
 * neighbors it has. Cells absent from the tally have zero live neighbors, so
 * neither survival nor reproduction can apply to them.
 */
const liveNeighborCounts = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const key of neighborKeysOf(cell)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

/**
 * Applies Conway's four rules to every candidate cell at once: a cell with
 * exactly 3 live neighbors is alive next generation (reproduction, or
 * survival), and a live cell with exactly 2 also survives. Every other cell
 * is dead, whether from underpopulation or overpopulation.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(toKey));

  return [...liveNeighborCounts(cells)]
    .filter(
      ([key, count]) =>
        count === NEIGHBORS_TO_BE_BORN ||
        (count === NEIGHBORS_TO_SURVIVE && livingKeys.has(key)),
    )
    .map(([key]) => toCell(key));
}
