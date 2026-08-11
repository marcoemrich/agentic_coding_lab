export type Cell = [number, number];

// A cell key is the sole representation of a coordinate inside a Set/Map.
type CellKey = string;
const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;
const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

// Rules 1-4: a cell with exactly 3 live neighbors is alive next generation
// (survival or reproduction); a live cell with 2 also survives. Every other
// count is death by under- or overpopulation.
const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const isAliveNextGeneration = (liveNeighbors: number, isCurrentlyAlive: boolean): boolean =>
  liveNeighbors === NEIGHBORS_FOR_BIRTH ||
  (liveNeighbors === NEIGHBORS_FOR_SURVIVAL && isCurrentlyAlive);

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));

  // Only cells adjacent to a living cell can be alive next generation, so
  // counting neighbors of living cells alone covers the infinite grid.
  return [...countLiveNeighbors(cells)]
    .filter(([cell, count]) => isAliveNextGeneration(count, living.has(cell)))
    .map(([cell]) => fromKey(cell));
}
