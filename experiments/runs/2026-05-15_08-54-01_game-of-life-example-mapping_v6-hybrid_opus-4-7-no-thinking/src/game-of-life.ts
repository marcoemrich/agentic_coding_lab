export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => {
  const [xs, ys] = k.split(",");
  return [Number(xs), Number(ys)];
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = key(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const survives = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && alive.has(k));

  return Array.from(neighborCounts)
    .filter(([k, count]) => survives(k, count))
    .map(([k]) => parseKey(k));
};
