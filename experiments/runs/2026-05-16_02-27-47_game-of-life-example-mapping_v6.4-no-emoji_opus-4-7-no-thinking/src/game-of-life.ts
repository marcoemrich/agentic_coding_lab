type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey([x + dx, y + dy]);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
};

const survivesOrIsBorn = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(liveCells.has(key), count)) {
      nextCells.push(fromKey(key));
    }
  }
  return nextCells;
};
