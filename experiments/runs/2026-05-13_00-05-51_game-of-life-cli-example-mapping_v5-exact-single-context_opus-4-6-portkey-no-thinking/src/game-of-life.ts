type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const nextGeneration = (aliveCells: Cell[]): Cell[] => {
  const aliveSet = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));

  const countNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => aliveSet.has(cellKey(x + dx, y + dy))).length;

  const survivors = aliveCells.filter(([x, y]) => {
    const neighbors = countNeighbors(x, y);
    return neighbors === 2 || neighbors === 3;
  });

  const deadCandidates = new Map<string, Cell>();
  for (const [x, y] of aliveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = cellKey(nx, ny);
      if (!aliveSet.has(key)) deadCandidates.set(key, [nx, ny]);
    }
  }

  const born = [...deadCandidates.values()].filter(
    ([x, y]) => countNeighbors(x, y) === 3
  );

  return [...survivors, ...born].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

export const advance = (aliveCells: Cell[], steps: number): Cell[] => {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = nextGeneration(current);
  }
  return current;
};
