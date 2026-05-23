export type Cell = [number, number];

const coordKey = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => coordKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = coordKey(nx, ny);
      const existing = neighborCounts.get(key);
      if (existing) existing.count += 1;
      else neighborCounts.set(key, { cell: [nx, ny], count: 1 });
    }
  }

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(key, count)) result.push(cell);
  }
  return result;
}
