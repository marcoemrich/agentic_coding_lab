const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): [number, number] => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: [number, number][] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push(fromKey(key));
    }
  }

  return result;
};
