export type Cell = [number, number]; // [x, y]

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;
const fromKey = (key: CellKey): Cell => key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_BIRTH = 3;

const isAliveNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_TO_BIRTH ||
  (isAlive && liveNeighbors === NEIGHBORS_TO_SURVIVE);

const countLiveNeighbors = (cells: Cell[]): Map<CellKey, number> => {
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
  const living = new Set(cells.map(toKey));

  return Array.from(countLiveNeighbors(cells))
    .filter(([key, liveNeighbors]) =>
      isAliveNextGeneration(living.has(key), liveNeighbors),
    )
    .map(([key]) => fromKey(key));
}
