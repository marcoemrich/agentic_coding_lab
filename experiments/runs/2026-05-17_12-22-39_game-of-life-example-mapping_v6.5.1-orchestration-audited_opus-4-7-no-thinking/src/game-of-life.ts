export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const countLiveNeighbors = (
  liveCells: Cell[],
): Map<string, { cell: Cell; count: number }> => {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(keyOf));
  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  return Array.from(countLiveNeighbors(liveCells))
    .filter(([key, { count }]) => survives(key, count))
    .map(([, { cell }]) => cell);
};
