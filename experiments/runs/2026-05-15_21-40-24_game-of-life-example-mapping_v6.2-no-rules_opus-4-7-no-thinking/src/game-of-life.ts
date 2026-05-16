export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const entry = neighbors.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        neighbors.set(key, { cell, count: 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighbors) {
    if (survives(count, liveKeys.has(key))) {
      result.push(cell);
    }
  }
  return result;
}
