const tallyNeighborCounts = (aliveCells: number[][]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
  return counts;
};

export const nextGeneration = (aliveCells: number[][]): number[][] => {
  const aliveSet = new Set(aliveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = tallyNeighborCounts(aliveCells);

  const result: number[][] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    if (count === 3 || (count === 2 && aliveSet.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
};
