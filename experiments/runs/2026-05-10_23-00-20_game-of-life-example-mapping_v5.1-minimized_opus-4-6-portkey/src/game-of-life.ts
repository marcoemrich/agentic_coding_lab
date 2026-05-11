export const nextGeneration = (liveCells: [number, number][]): [number, number][] => {
  const alive = new Set(liveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: [number, number][] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
};
