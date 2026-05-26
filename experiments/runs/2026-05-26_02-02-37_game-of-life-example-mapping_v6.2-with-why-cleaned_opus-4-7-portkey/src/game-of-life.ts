/** A live cell on the infinite grid, identified by its [x, y] coordinates. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

type NeighborTally = Map<string, { cell: Cell; liveNeighborCount: number }>;

/**
 * For every cell adjacent to at least one live cell, records how many live cells
 * it neighbors. These are the only cells that can possibly be alive next generation.
 */
function tallyNeighborCounts(liveCells: Cell[]): NeighborTally {
  const tally: NeighborTally = new Map();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = tally.get(key);
      if (entry) {
        entry.liveNeighborCount++;
      } else {
        tally.set(key, { cell: neighbor, liveNeighborCount: 1 });
      }
    }
  }
  return tally;
}

/**
 * Computes the next generation of live cells according to Conway's Game of Life rules.
 * Uses a sparse representation: only live cells are listed; cells not listed are dead.
 *
 * @param liveCells - Coordinates of currently live cells (order is not significant)
 * @returns Coordinates of cells that will be live in the next generation
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(keyOf));
  const candidates = tallyNeighborCounts(liveCells);

  const nextLiveCells: Cell[] = [];
  for (const [key, { cell, liveNeighborCount }] of candidates) {
    if (survives(aliveKeys.has(key), liveNeighborCount)) {
      nextLiveCells.push(cell);
    }
  }
  return nextLiveCells;
}
