export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const tallyLiveNeighbors = (
  liveCells: Cell[],
): Map<string, { cell: Cell; count: number }> => {
  const tally = new Map<string, { cell: Cell; count: number }>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const k = cellKey(neighbor);
      const entry = tally.get(k);
      if (entry) {
        entry.count += 1;
      } else {
        tally.set(k, { cell: neighbor, count: 1 });
      }
    }
  }
  return tally;
};

const isAliveNextGen = (
  key: string,
  neighborCount: number,
  liveKeys: Set<string>,
): boolean =>
  neighborCount === 3 || (neighborCount === 2 && liveKeys.has(key));

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const tally = tallyLiveNeighbors(liveCells);

  const result: Cell[] = [];
  for (const [key, { cell, count }] of tally) {
    if (isAliveNextGen(key, count, liveKeys)) {
      result.push(cell);
    }
  }
  return result;
};
