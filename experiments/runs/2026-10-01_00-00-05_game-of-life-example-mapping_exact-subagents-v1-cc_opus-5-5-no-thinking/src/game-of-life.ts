export type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const countNeighbors = (liveCells: Cell[]): Map<string, number> => {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey([x + dx, y + dy]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }
  return neighborCounts;
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const alive = new Set(liveCells.map(toKey));
  const isAliveNext = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && alive.has(key));
  return [...countNeighbors(liveCells)]
    .filter(([key, count]) => isAliveNext(key, count))
    .map(([key]) => fromKey(key));
};
