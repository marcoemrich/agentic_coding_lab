/** A live cell identified by its [x, y] coordinates. */
type Cell = [number, number];

/** Encodes a cell as a string so it can be used as a Set/Map key. */
const toKey = ([x, y]: Cell): string => `${x},${y}`;

/** Decodes a string key back into a cell. */
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

/** The eight offsets from a cell to each of its surrounding neighbors. */
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/** The eight cells immediately surrounding the given cell. */
const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

/** A dead cell is born when it has exactly this many live neighbors. */
const NEIGHBORS_FOR_BIRTH = 3;
/** A live cell survives when it has exactly this many live neighbors. */
const NEIGHBORS_FOR_SURVIVAL = 2;

/**
 * Conway's transition rule: a cell is live next generation when it has
 * exactly 3 live neighbors (birth), or it is currently alive and has
 * exactly 2 live neighbors (survival).
 */
const willLive = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_FOR_BIRTH ||
  (isAlive && liveNeighbors === NEIGHBORS_FOR_SURVIVAL);

/**
 * Tallies, for every cell adjacent to at least one live cell, how many live
 * neighbors it has. Cells with no live neighbors never appear — they cannot
 * be born and need no consideration.
 */
const countLiveNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(toKey));

  return [...countLiveNeighbors(cells)]
    .filter(([key, liveNeighbors]) =>
      willLive(liveCellKeys.has(key), liveNeighbors),
    )
    .map(([key]) => fromKey(key));
}
