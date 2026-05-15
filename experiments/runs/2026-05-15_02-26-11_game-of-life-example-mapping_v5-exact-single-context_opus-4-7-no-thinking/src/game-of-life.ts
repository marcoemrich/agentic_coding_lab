type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = keyOf(neighbor);
      const entry = neighborCounts.get(k);
      if (entry) entry.count++;
      else neighborCounts.set(k, { cell: neighbor, count: 1 });
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (livesNextGeneration(count, liveSet.has(k))) result.push(cell);
  }
  return result;
}

function livesNextGeneration(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}
