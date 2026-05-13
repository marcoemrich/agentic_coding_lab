type Cell = [number, number];

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export const nextGeneration = (aliveCells: Cell[]): Cell[] => {
  const aliveSet = new Set(aliveCells.map(cellKey));

  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of aliveCells) {
    for (const neighbor of neighbors(cell)) {
      const k = cellKey(neighbor);
      const entry = neighborCounts.get(k) ?? { cell: neighbor, count: 0 };
      entry.count++;
      neighborCounts.set(k, entry);
    }
  }

  const next: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && aliveSet.has(k))) {
      next.push(cell);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);
};
