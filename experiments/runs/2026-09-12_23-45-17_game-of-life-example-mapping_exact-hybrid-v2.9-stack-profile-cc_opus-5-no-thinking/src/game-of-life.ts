export type Cell = [number, number];

type CellKey = string;

const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const countLivingNeighbors = (livingCells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const livingKeys = new Set(livingCells.map(toKey));

  const isAliveNextGeneration = (key: CellKey, neighbors: number): boolean =>
    neighbors === NEIGHBORS_FOR_BIRTH ||
    (neighbors === NEIGHBORS_FOR_SURVIVAL && livingKeys.has(key));

  return [...countLivingNeighbors(livingCells)]
    .filter(([key, neighbors]) => isAliveNextGeneration(key, neighbors))
    .map(([key]) => fromKey(key));
};
