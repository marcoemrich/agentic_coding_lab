export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesToNextGeneration = (neighbors: number, wasAlive: boolean): boolean =>
  neighbors === 3 || (neighbors === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const entry = neighbors.get(key);
      if (entry) entry.count++;
      else neighbors.set(key, { cell, count: 1 });
    }
  }

  return Array.from(neighbors)
    .filter(([key, { count }]) => survivesToNextGeneration(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
