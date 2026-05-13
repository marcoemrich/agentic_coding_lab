const tick = (cells: number[][]): number[][] => {
  const aliveSet = new Set(cells.map(([x, y]) => `${x},${y}`));

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

  const result: number[][] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    if (count === 3 || (count === 2 && aliveSet.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
};

export const nextGeneration = (aliveCells: number[][], steps: number): number[][] => {
  let cells = aliveCells;
  for (let step = 0; step < steps; step++) {
    cells = tick(cells);
  }
  cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return cells;
};
