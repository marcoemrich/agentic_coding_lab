export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const tallyNeighborCounts = (cells: Cell[]): Map<string, { cell: Cell; count: number }> => {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
};

const survivesOrIsBorn = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(cellKey));
  const neighborCounts = tallyNeighborCounts(cells);

  const nextCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survivesOrIsBorn(liveCells.has(key), count)) {
      nextCells.push(cell);
    }
  }
  return nextCells;
};
