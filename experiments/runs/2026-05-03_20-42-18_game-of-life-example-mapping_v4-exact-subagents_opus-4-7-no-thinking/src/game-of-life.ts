type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survivesOrIsBorn = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      neighborCounts.set(key, entry);
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survivesOrIsBorn(liveSet.has(key), count)) {
      result.push(cell);
    }
  }

  return result;
}
