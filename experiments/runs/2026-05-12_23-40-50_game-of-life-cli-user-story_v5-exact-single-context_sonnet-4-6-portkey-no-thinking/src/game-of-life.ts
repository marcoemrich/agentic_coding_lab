type Cell = [number, number];

const key = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const nextGeneration = (aliveCells: Cell[]): Cell[] => {
  const aliveSet = new Set(aliveCells.map(key));
  const neighborCount = new Map<string, { cell: Cell; count: number }>();

  for (const cell of aliveCells) {
    for (const neighbor of neighbors(cell)) {
      const k = key(neighbor);
      if (!neighborCount.has(k)) neighborCount.set(k, { cell: neighbor, count: 0 });
      const entry = neighborCount.get(k)!;
      entry.count += 1;
    }
  }

  const isAliveNextGen = (count: number, isAlive: boolean): boolean =>
    count === 3 || (count === 2 && isAlive);

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCount) {
    if (isAliveNextGen(count, aliveSet.has(k))) {
      result.push(cell);
    }
  }
  return result;
};

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);

export const step = (aliveCells: Cell[], steps: number): Cell[] => {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) current = nextGeneration(current);
  return sortCells(current);
};
