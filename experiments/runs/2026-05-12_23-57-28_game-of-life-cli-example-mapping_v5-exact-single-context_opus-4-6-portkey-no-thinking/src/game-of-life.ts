const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): number[] => key.split(",").map(Number);

export const advanceGameOfLife = (aliveCells: number[][], steps: number): number[][] => {
  if (steps === 0) return aliveCells;

  const alive = new Set(aliveCells.map(([x, y]) => toKey(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  const nextGeneration: number[][] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      nextGeneration.push(fromKey(key));
    }
  }

  nextGeneration.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return advanceGameOfLife(nextGeneration, steps - 1);
};
