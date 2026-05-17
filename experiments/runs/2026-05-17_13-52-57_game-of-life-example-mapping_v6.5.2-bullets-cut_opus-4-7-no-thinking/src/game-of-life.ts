export type LiveCell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: LiveCell): string => `${x},${y}`;

const neighborsOf = ([x, y]: LiveCell): LiveCell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const shouldLive = (isAlive: boolean, neighborCount: number): boolean =>
  isAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;

export function nextGeneration(liveCells: LiveCell[]): LiveCell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: LiveCell; count: number }>();

  for (const liveCell of liveCells) {
    for (const cell of neighborsOf(liveCell)) {
      const key = cellKey(cell);
      const entry = neighborCounts.get(key) ?? { cell, count: 0 };
      entry.count += 1;
      neighborCounts.set(key, entry);
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => shouldLive(liveSet.has(key), count))
    .map(([, { cell }]) => cell);
}
