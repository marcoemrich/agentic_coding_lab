function nextGeneration(aliveCells: number[][]): number[][] {
  const alive = new Set(aliveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === 3 || (count === 2 && alive.has(key)))
    .map(([key]) => key.split(",").map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

export function advanceGame(aliveCells: number[][], steps: number): number[][] {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = nextGeneration(current);
  }
  return current;
}
