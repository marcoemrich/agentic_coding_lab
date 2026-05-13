export type Cell = [number, number];

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const step = (aliveCells: Cell[]): Cell[] => {
  const alive = new Set(aliveCells.map(cellKey));
  const neighborCount = new Map<string, { cell: Cell; count: number }>();

  for (const cell of aliveCells) {
    for (const neighbor of neighbors(cell)) {
      const k = cellKey(neighbor);
      if (!neighborCount.has(k)) neighborCount.set(k, { cell: neighbor, count: 0 });
      neighborCount.get(k)!.count++;
    }
  }

  const next: Cell[] = [];
  for (const [k, { cell, count }] of neighborCount) {
    if (count === 3 || (count === 2 && alive.has(k))) {
      next.push(cell);
    }
  }
  return next.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

export const advance = (aliveCells: Cell[], steps: number): Cell[] => {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) current = step(current);
  return current;
};
