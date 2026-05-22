/** A live cell's position on the infinite grid as [x, y] coordinates. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const keyToCell = (k: string): Cell =>
  k.split(",").map(Number) as [number, number];

const tallyLiveNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

/**
 * Computes the next generation of live cells in Conway's Game of Life.
 *
 * @param cells - The currently live cells on the infinite grid.
 * @returns The live cells in the next generation.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const isAliveNext = (key: string, liveNeighbors: number): boolean =>
    liveNeighbors === 3 || (liveNeighbors === 2 && liveKeys.has(key));

  const nextLive: Cell[] = [];
  for (const [key, count] of tallyLiveNeighbors(cells)) {
    if (isAliveNext(key, count)) nextLive.push(keyToCell(key));
  }
  return nextLive;
}
