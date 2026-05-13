const nextGeneration = (cells: number[][]): number[][] => {
  const alive = new Set(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: number[][] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      next.push(key.split(",").map(Number));
    }
  }

  return next;
};

export const simulate = (aliveCells: number[][], steps: number): number[][] => {
  let cells = aliveCells;
  for (let s = 0; s < steps; s++) {
    cells = nextGeneration(cells);
  }
  return cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
