export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_FOR_BIRTH = 3;

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const livesOn = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive
    ? liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
    : liveNeighbors === NEIGHBORS_FOR_BIRTH;

/**
 * Counts live neighbors for every cell adjacent to a living cell. Living cells
 * with no living neighbors get an explicit count of 0 so that the rules decide
 * their fate rather than their absence from the map.
 */
const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const cell of cells) {
    counts.set(toKey(cell), 0);
  }
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  return [...neighborCounts]
    .filter(([key, liveNeighbors]) => livesOn(living.has(key), liveNeighbors))
    .map(([key]) => fromKey(key));
}
