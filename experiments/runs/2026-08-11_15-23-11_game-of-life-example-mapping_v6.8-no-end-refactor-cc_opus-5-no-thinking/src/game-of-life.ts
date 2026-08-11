/** A cell's position on the infinite grid, as [x, y]. */
export type Cell = [x: number, y: number];

/** A live cell with 2 or 3 live neighbours survives; fewer or more kills it. */
const SURVIVAL_NEIGHBOURS = [2, 3];

/** A dead cell with exactly this many live neighbours is born. */
const BIRTH_NEIGHBOURS = 3;

/** The 8 cells surrounding a position, in reading order. */
const neighboursOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

/**
 * Cell tuples are compared by reference, so they cannot be used as Set members
 * directly. This converts a cell to a value-comparable key.
 */
const toKey = ([x, y]: Cell): string => `${x},${y}`;

/** Deduplicates cells by position, keeping one tuple per distinct key. */
const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [toKey(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));

  const countLiveNeighbours = (cell: Cell): number =>
    neighboursOf(cell).filter((neighbour) => liveKeys.has(toKey(neighbour)))
      .length;

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const liveNeighbours = countLiveNeighbours(cell);

    return liveKeys.has(toKey(cell))
      ? SURVIVAL_NEIGHBOURS.includes(liveNeighbours)
      : liveNeighbours === BIRTH_NEIGHBOURS;
  };

  // Only live cells and their neighbours can be alive next generation —
  // everywhere else has 0 live neighbours and stays dead.
  const candidates = uniqueCells(
    liveCells.flatMap((cell) => [cell, ...neighboursOf(cell)]),
  );

  return candidates.filter(isAliveNextGeneration);
}
