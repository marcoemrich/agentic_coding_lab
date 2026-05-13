type Cell = [number, number];

const key = (x: number, y: number) => `${x},${y}`;

const sortedCells = (cells: Cell[]): Cell[] =>
  cells.slice().sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);

const neighborCoords = (x: number, y: number): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const step = (aliveCells: Cell[]): Cell[] => {
  const alive = new Set(aliveCells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { x: number; y: number; count: number }>();

  for (const [x, y] of aliveCells) {
    for (const [nx, ny] of neighborCoords(x, y)) {
      const k = key(nx, ny);
      if (!neighborCounts.has(k)) neighborCounts.set(k, { x: nx, y: ny, count: 0 });
      neighborCounts.get(k)!.count += 1;
    }
  }

  const born = (count: number) => count === 3;
  const survives = (count: number, k: string) => count === 2 && alive.has(k);

  const next: Cell[] = [];
  for (const { x, y, count } of neighborCounts.values()) {
    if (born(count) || survives(count, key(x, y))) {
      next.push([x, y]);
    }
  }

  return next;
};

export const advance = (aliveCells: Cell[], steps: number): Cell[] => {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = step(current);
  }
  return sortedCells(current);
};
