type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

const countLiveNeighbors = (
  liveCells: Cell[],
): Map<string, { cell: Cell; count: number }> => {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const previous = counts.get(key)?.count ?? 0;
      counts.set(key, { cell: neighbor, count: previous + 1 });
    }
  }
  return counts;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = countLiveNeighbors(liveCells);

  return Array.from(neighborCounts)
    .filter(([key, { count }]) => survives(liveKeys.has(key), count))
    .map(([, { cell }]) => cell);
}
