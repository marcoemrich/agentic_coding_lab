export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = cellKey(nx, ny);
      const entry = neighborCounts.get(k);
      if (entry) {
        entry.count++;
      } else {
        neighborCounts.set(k, { cell: [nx, ny], count: 1 });
      }
    }
  }

  const survives = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && liveCells.has(k));

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(k, count)) {
      result.push(cell);
    }
  }
  return result;
}
