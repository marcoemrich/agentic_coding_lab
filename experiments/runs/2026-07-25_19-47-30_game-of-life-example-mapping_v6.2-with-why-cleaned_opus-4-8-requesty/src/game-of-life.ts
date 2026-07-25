/** A live cell's position as [x, y] grid coordinates. */
type Cell = [number, number];

/** A cell serialized as an "x,y" string, usable as a Set/Map key. */
type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;
const fromKey = (key: CellKey): Cell => key.split(",").map(Number) as Cell;

/** The 8 offsets from a cell to each of its surrounding neighbors. */
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/**
 * Conway's rules: a cell is alive next generation if it has exactly 3 live
 * neighbors (birth / survival) or is already alive with exactly 2 (survival).
 */
const isAliveNextGen = (liveNeighbors: number, isCurrentlyLive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isCurrentlyLive);

/**
 * Tallies, for every cell adjacent to a live cell, how many live neighbors it
 * has. Cells absent from the map have zero live neighbors and can never come
 * alive, so they need no consideration next generation.
 */
const tallyNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const neighborCounts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  return neighborCounts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));

  return [...tallyNeighbors(cells)]
    .filter(([key, liveNeighbors]) => isAliveNextGen(liveNeighbors, liveCells.has(key)))
    .map(([key]) => fromKey(key));
}
