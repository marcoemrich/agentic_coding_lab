export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (count: number, wasAlive: boolean): boolean =>
  wasAlive ? count === 2 || count === 3 : count === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count++;
      neighborCounts.set(key, entry);
    }
  }

  const next: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(count, alive.has(key))) next.push(cell);
  }
  return next;
}
