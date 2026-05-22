export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  isAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;

export function nextGeneration(cells: Array<Cell>): Array<Cell> {
  const liveSet = new Set(cells.map(keyOf));

  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = keyOf(neighbor);
      const entry = neighborCounts.get(k);
      if (entry) entry.count += 1;
      else neighborCounts.set(k, { cell: neighbor, count: 1 });
    }
  }

  const result: Array<Cell> = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(liveSet.has(k), count)) result.push(cell);
  }
  return result;
}
