export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survivesOrIsBorn = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const entry = neighbors.get(key) ?? { cell, count: 0 };
      entry.count++;
      neighbors.set(key, entry);
    }
  }

  return [...neighbors]
    .filter(([key, { count }]) => survivesOrIsBorn(count, alive.has(key)))
    .map(([, { cell }]) => cell);
}
