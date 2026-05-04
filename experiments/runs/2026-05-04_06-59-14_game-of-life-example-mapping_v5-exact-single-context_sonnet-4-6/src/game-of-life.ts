type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const getNeighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const [nx, ny] of getNeighbors(cell)) {
      const key = toKey([nx, ny]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const isAlive = alive.has(key);
    if (isAlive && (count === 2 || count === 3)) result.push([x, y]);
    if (!isAlive && count === 3) result.push([x, y]);
  }

  return result;
};
