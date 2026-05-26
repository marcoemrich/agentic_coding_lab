/**
 * A live cell on the Game of Life grid, represented as [x, y] coordinates.
 * The grid is conceptually infinite; only live cells are tracked.
 */
export type Cell = [number, number];

/**
 * Computes the next generation of live cells from the current generation
 * by applying Conway's Game of Life rules:
 * - A live cell with 2 or 3 live neighbors survives.
 * - A dead cell with exactly 3 live neighbors becomes alive (reproduction).
 * - All other cells are dead in the next generation (underpopulation
 *   when <2 live neighbors, overpopulation when >3).
 */
const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const liveKeys = new Set(currentGeneration.map(cellKey));
  const candidates = new Map<string, { cell: Cell; liveNeighborCount: number }>();

  for (const [x, y] of currentGeneration) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const existing = candidates.get(key);
      candidates.set(key, {
        cell,
        liveNeighborCount: (existing?.liveNeighborCount ?? 0) + 1,
      });
    }
  }

  const survives = (key: string, liveNeighborCount: number): boolean =>
    liveNeighborCount === 3 || (liveNeighborCount === 2 && liveKeys.has(key));

  return Array.from(candidates)
    .filter(([key, { liveNeighborCount }]) => survives(key, liveNeighborCount))
    .map(([, { cell }]) => cell);
}
