export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = cellKey(neighbor);
      const entry = neighborCounts.get(k);
      if (entry) entry.count++;
      else neighborCounts.set(k, { cell: neighbor, count: 1 });
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(k))) result.push(cell);
  }
  return result;
}
