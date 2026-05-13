export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export const nextGeneration = (aliveCells: Cell[]): Cell[] => {
  const alive = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, count]) => count === 3 || (count === 2 && alive.has(key)))
    .map(([key]) => key.split(",").map(Number) as Cell)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

export const advance = (aliveCells: Cell[], steps: number): Cell[] => {
  let cells = aliveCells;
  for (let i = 0; i < steps; i++) {
    cells = nextGeneration(cells);
  }
  return cells;
};
