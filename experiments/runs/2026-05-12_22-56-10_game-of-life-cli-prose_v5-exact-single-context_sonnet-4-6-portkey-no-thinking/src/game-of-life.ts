const toKey = ([x, y]: [number, number]): string => `${x},${y}`;

const fromKey = (key: string): [number, number] =>
  key.split(",").map(Number) as [number, number];

const neighbors = ([x, y]: [number, number]): [number, number][] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const countAliveNeighbors = (cell: [number, number], alive: Set<string>): number =>
  neighbors(cell).filter((n) => alive.has(toKey(n))).length;

export const step = (aliveCells: [number, number][], stepCount: number): [number, number][] => {
  if (stepCount === 0) return aliveCells;

  const alive = new Set(aliveCells.map(toKey));

  const candidates = new Set<string>();
  for (const cell of aliveCells) {
    for (const n of neighbors(cell)) {
      if (!alive.has(toKey(n))) candidates.add(toKey(n));
    }
  }

  const survived: [number, number][] = [];
  for (const cell of aliveCells) {
    const neighborCount = countAliveNeighbors(cell, alive);
    if (neighborCount === 2 || neighborCount === 3) survived.push(cell);
  }

  const born: [number, number][] = [];
  for (const key of candidates) {
    const cell = fromKey(key);
    if (countAliveNeighbors(cell, alive) === 3) born.push(cell);
  }

  return [...survived, ...born].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
};
