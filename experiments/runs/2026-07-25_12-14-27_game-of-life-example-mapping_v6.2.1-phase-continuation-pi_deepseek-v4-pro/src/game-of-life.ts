export function nextGeneration(cells: [number, number][]): [number, number][] {
  const liveSet = new Set(cells.map(([x, y]) => `${x},${y}`));

  // Count live neighbors for every cell and its adjacent dead cells in one pass
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  // Survival: live cells with 2 or 3 neighbors live on
  const result: [number, number][] = [];
  for (const [x, y] of cells) {
    const key = `${x},${y}`;
    const count = neighborCounts.get(key) || 0;
    if (count === 2 || count === 3) {
      result.push([x, y]);
    }
  }

  // Reproduction: dead cells with exactly 3 neighbors are born
  for (const [key, count] of neighborCounts) {
    if (count === 3 && !liveSet.has(key)) {
      const [nx, ny] = key.split(",").map(Number) as [number, number];
      result.push([nx, ny]);
    }
  }

  return result;
}