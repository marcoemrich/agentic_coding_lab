export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseCellKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = cellKey(x + dx, y + dy);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
};

const survivesOrIsBorn = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (survivesOrIsBorn(aliveCells.has(k), count)) {
      nextCells.push(parseCellKey(k));
    }
  }
  return nextCells;
};
