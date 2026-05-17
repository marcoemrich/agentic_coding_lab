export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const alive = new Set(liveCells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) entry.count++;
      else neighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }
  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) result.push(cell);
  }
  return result;
}
