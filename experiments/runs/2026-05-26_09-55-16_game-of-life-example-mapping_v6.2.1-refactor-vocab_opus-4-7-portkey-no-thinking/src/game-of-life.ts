/** A live cell's position on an infinite grid, expressed as [x, y] coordinates. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesOrIsBorn = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (wasAlive && liveNeighbors === 2);

/**
 * Applies Conway's Game of Life rules to the given live cells and returns
 * the next generation. Dead cells are implicit: any coordinate not listed is dead.
 *
 * Single-pass strategy: for each live cell, increment a neighbor-count for each
 * of its 8 surrounding positions. A position appears in the next generation when
 * it has exactly 3 live neighbors, or it was alive and has exactly 2.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const livingKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 };
      neighborCounts.set(key, { cell: entry.cell, count: entry.count + 1 });
    }
  }
  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => survivesOrIsBorn(livingKeys.has(key), count))
    .map(([, { cell }]) => cell);
}
