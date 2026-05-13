type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as [number, number];

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const step = (aliveCells: Cell[]): Cell[] => {
  const aliveSet = new Set(aliveCells.map(toKey));
  const neighborCount = new Map<string, number>();

  for (const cell of aliveCells) {
    for (const [nx, ny] of neighbors(cell)) {
      const key = toKey([nx, ny]);
      neighborCount.set(key, (neighborCount.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCount) {
    const [x, y] = fromKey(key);
    if (count === 3 || (count === 2 && aliveSet.has(key))) {
      next.push([x, y]);
    }
  }

  return next.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);
};

export const advance = (aliveCells: Cell[], steps: number): Cell[] => {
  if (steps === 0) return aliveCells;
  return step(aliveCells);
};
