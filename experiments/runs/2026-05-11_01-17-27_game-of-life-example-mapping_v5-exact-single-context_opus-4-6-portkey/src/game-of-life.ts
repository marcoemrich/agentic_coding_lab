const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): [number, number] => key.split(",").map(Number) as [number, number];

export const nextGeneration = (liveCells: [number, number][]): [number, number][] => {
  const alive = new Set(liveCells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  const nextLiveCells: [number, number][] = [];
  for (const [key, count] of neighborCounts) {
    const livesNext = count === 3 || (count === 2 && alive.has(key));
    if (livesNext) {
      nextLiveCells.push(fromKey(key));
    }
  }

  return nextLiveCells;
};
