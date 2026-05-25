/** A live cell at coordinates (x, y). */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] => {
  const seen = new Map<string, Cell>();
  for (const cell of cells) seen.set(key(cell), cell);
  return [...seen.values()];
};

const isLive = (cell: Cell, liveKeys: Set<string>): boolean =>
  liveKeys.has(key(cell));

const countLiveNeighbors = (cell: Cell, liveKeys: Set<string>): number =>
  neighborsOf(cell).filter((n) => isLive(n, liveKeys)).length;

const livesNextGeneration = (cell: Cell, liveKeys: Set<string>): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveKeys);
  // Conway's rules: a live cell survives with 2 or 3 neighbors;
  // a dead cell is born with exactly 3 neighbors.
  return isLive(cell, liveKeys)
    ? liveNeighbors === 2 || liveNeighbors === 3
    : liveNeighbors === 3;
};

/**
 * Computes the next generation of Conway's Game of Life
 * from the currently live cells.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(key));
  const candidates = uniqueCells([...liveCells, ...liveCells.flatMap(neighborsOf)]);
  return candidates.filter((cell) => livesNextGeneration(cell, liveKeys));
}
