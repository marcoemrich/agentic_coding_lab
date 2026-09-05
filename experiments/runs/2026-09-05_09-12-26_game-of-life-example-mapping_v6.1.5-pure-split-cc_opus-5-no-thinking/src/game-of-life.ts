export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const neighborsOf = (x: number, y: number): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

/**
 * The four rules of Conway's Game of Life, in the specification's own terms.
 *
 * Rule 1 – underpopulation: a live cell with fewer than 2 live neighbors dies.
 * Rule 3 – overpopulation: a live cell with more than 3 live neighbors dies.
 * Both are expressed here as the surviving band they carve out, so that every
 * rule participates in the decision rather than sitting unused as a comment.
 */
const survivesUnderpopulation = (liveNeighbors: number): boolean => liveNeighbors >= 2;

const survivesOverpopulation = (liveNeighbors: number): boolean => liveNeighbors <= 3;

/** Rule 2 – survival: a live cell with 2 or 3 live neighbors lives on. */
const survives = (liveNeighbors: number): boolean =>
  survivesUnderpopulation(liveNeighbors) && survivesOverpopulation(liveNeighbors);

/** Rule 4 – reproduction: a dead cell with exactly 3 live neighbors becomes alive. */
const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

const livesOn = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive ? survives(liveNeighbors) : isBorn(liveNeighbors);

/**
 * Every cell that could be alive next generation — each live cell's neighbors —
 * paired with how many live neighbors it has. Cells with no live neighbor at all
 * are omitted: they are dead now and stay dead, by all four rules.
 */
function liveNeighborCounts(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const neighbor of neighborsOf(x, y)) {
      const key = cellKey(...neighbor);
      const entry = counts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map((cell) => cellKey(...cell)));

  const nextLiving: Cell[] = [];
  for (const [key, { cell, count }] of liveNeighborCounts(cells)) {
    if (livesOn(living.has(key), count)) nextLiving.push(cell);
  }
  return nextLiving;
}
