const cellKey = (x: number, y: number): string => `${x},${y}`;

const compareCell = ([ax, ay]: [number, number], [bx, by]: [number, number]): number =>
  ax !== bx ? ax - bx : ay - by;

const forEachNeighbor = (x: number, y: number, fn: (nx: number, ny: number) => void): void => {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      fn(x + dx, y + dy);
    }
  }
};

export const step = (aliveCells: [number, number][]): [number, number][] => {
  const alive = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));

  const neighborCount = (x: number, y: number): number => {
    let count = 0;
    forEachNeighbor(x, y, (nx, ny) => { if (alive.has(cellKey(nx, ny))) count++; });
    return count;
  };

  const survivors = aliveCells.filter(([x, y]) => {
    const neighbors = neighborCount(x, y);
    return neighbors === 2 || neighbors === 3;
  });

  const candidates = new Set<string>();
  for (const [x, y] of aliveCells) {
    forEachNeighbor(x, y, (nx, ny) => {
      const key = cellKey(nx, ny);
      if (!alive.has(key)) candidates.add(key);
    });
  }

  const born: [number, number][] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (neighborCount(x, y) === 3) born.push([x, y]);
  }

  return [...survivors, ...born].sort(compareCell);
};

export const simulate = (aliveCells: [number, number][], steps: number): [number, number][] => {
  let cells = aliveCells;
  for (let i = 0; i < steps; i++) {
    cells = step(cells);
  }
  return cells;
};
