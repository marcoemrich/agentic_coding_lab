export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const isAlive = (wasAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (wasAlive && neighborCount === 2);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(toKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const entry = neighborCounts.get(key);
      if (entry) entry.count++;
      else neighborCounts.set(key, { cell, count: 1 });
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAlive(liveSet.has(key), count)) result.push(cell);
  }
  return result;
}
