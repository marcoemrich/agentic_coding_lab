export type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const willBeAlive = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (willBeAlive(count, aliveKeys.has(key))) {
      result.push(fromKey(key));
    }
  }
  return result;
};
