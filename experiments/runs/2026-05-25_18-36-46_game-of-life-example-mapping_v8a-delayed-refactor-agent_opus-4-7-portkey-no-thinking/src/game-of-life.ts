type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const nKey = key(nx, ny);
      const existing = neighborCounts.get(nKey);
      if (existing) {
        existing.count++;
      } else {
        neighborCounts.set(nKey, { cell: [nx, ny], count: 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    const isAlive = liveSet.has(k);
    if (count === 3 || (isAlive && count === 2)) {
      result.push(cell);
    }
  }
  return result;
}
