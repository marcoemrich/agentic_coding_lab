export function nextGeneration(grid: number[][]): number[][] {
  if (grid.length === 0) return [];

  const alive = new Set(grid.map(([x, y]) => `${x},${y}`));

  const neighborCounts = new Map<string, number>();

  for (const [x, y] of grid) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  const result: number[][] = [];

  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}
