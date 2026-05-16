export type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (k: string): Cell => {
  const [x, y] = k.split(",");
  return [Number(x), Number(y)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const shouldBeAlive = (wasAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (wasAlive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [cellKey, count] of neighborCounts) {
    if (shouldBeAlive(liveCells.has(cellKey), count)) {
      nextCells.push(fromKey(cellKey));
    }
  }
  return nextCells;
};
