export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = (x: number, y: number): CellKey => `${x},${y}`;

/**
 * Computes the next generation of Conway's Game of Life on an infinite grid.
 *
 * Uses a sparse representation: only living cells are tracked. For each living
 * cell, we increment a neighbor-count for each of its 8 surrounding cells. A
 * cell appears in the next generation iff it has exactly 3 neighbors, or it is
 * currently alive with exactly 2 neighbors.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<CellKey>(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = countNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, { x, y, count }] of neighborCounts) {
    if (shouldBeAlive(count, liveCells.has(key))) {
      survivors.push([x, y]);
    }
  }
  return survivors;
}

interface NeighborTally {
  readonly x: number;
  readonly y: number;
  count: number;
}

function countNeighbors(cells: Cell[]): Map<CellKey, NeighborTally> {
  const tallies = new Map<CellKey, NeighborTally>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = keyOf(nx, ny);
      const existing = tallies.get(key);
      if (existing) {
        existing.count++;
      } else {
        tallies.set(key, { x: nx, y: ny, count: 1 });
      }
    }
  }
  return tallies;
}

function shouldBeAlive(neighborCount: number, isCurrentlyAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);
}
