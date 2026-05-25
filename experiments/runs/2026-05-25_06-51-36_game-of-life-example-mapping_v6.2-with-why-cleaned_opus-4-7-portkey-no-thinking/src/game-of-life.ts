/** A cell's position on an infinite grid, expressed as [x, y]. */
export type Cell = [number, number];

/** A canonical string form of a cell, used as a Map/Set key. */
type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

/** Offsets of the eight neighbours surrounding any cell. */
const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

/** Yields the eight neighbouring cells around the given cell. */
function* neighborsOf([x, y]: Cell): Iterable<Cell> {
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    yield [x + dx, y + dy];
  }
}

/**
 * Computes the next generation of live cells under Conway's Game of Life rules.
 *
 * @param liveCells - The currently live cells; any coordinate not listed is dead.
 * @returns The live cells in the next generation.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));

  // For each cell adjacent to at least one live cell, count its live neighbours.
  // Cells without any live neighbour are absent from the map — they cannot become alive.
  const liveNeighborCount = new Map<CellKey, number>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      liveNeighborCount.set(key, (liveNeighborCount.get(key) ?? 0) + 1);
    }
  }

  const survivesOrIsBorn = (key: CellKey, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  return Array.from(liveNeighborCount)
    .filter(([key, count]) => survivesOrIsBorn(key, count))
    .map(([key]) => fromKey(key));
}
