export type Cell = [number, number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_REPRODUCE = 3;

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

/** A displacement from a cell, not a position on the grid. */
type Offset = [number, number];

/** The eight surrounding positions; (0,0) is excluded so a cell is not its own neighbor. */
const ADJACENT_OFFSETS: Offset[] = [-1, 0, 1]
  .flatMap((dx): Offset[] => [-1, 0, 1].map((dy): Offset => [dx, dy]))
  .filter(([dx, dy]) => dx !== 0 || dy !== 0);

function neighborsOf([x, y]: Cell): Cell[] {
  return ADJACENT_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);
}

function countLiveNeighbors(
  cell: Cell,
  isAlive: (cell: Cell) => boolean,
): number {
  return neighborsOf(cell).filter(isAlive).length;
}

/**
 * Rules 1-3: a live cell dies of underpopulation below the minimum and of
 * overpopulation above the maximum; in between it lives on.
 */
function survives(liveNeighbors: number): boolean {
  return (
    liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
    liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
  );
}

/** Rule 4: a dead cell with exactly three live neighbors becomes alive. */
function reproduces(liveNeighbors: number): boolean {
  return liveNeighbors === NEIGHBORS_TO_REPRODUCE;
}

function uniqueByKey(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [keyOf(cell), cell])).values()];
}

function candidateCells(liveCells: Cell[]): Cell[] {
  return uniqueByKey(
    liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]),
  );
}

/**
 * Advances the grid one generation. Only living cells are stored, so the grid
 * is unbounded in every direction; a cell can change state only if it is alive
 * or adjacent to a living cell, so those cells alone are examined.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const isAlive = (cell: Cell): boolean => liveKeys.has(keyOf(cell));

  return candidateCells(cells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, isAlive);
    return isAlive(cell)
      ? survives(liveNeighbors)
      : reproduces(liveNeighbors);
  });
}
