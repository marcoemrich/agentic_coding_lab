export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const key = (x: number, y: number): string => `${x},${y}`;
  const live = new Set(cells.map(([x, y]) => key(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = key(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const survivesOrIsBorn = (isAlive: boolean, count: number): boolean =>
    count === 3 || (count === 2 && isAlive);

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const [x, y] = k.split(",").map(Number);
    if (survivesOrIsBorn(live.has(k), count)) {
      result.push([x, y]);
    }
  }
  return result;
};
