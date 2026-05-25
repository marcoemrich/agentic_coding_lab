export type Cell = [number, number];

const encode = ([x, y]: Cell): string => `${x},${y}`;
const decode = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(encode));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = encode([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(neighborCounts)
    .filter(([key, count]) => survives(count, liveSet.has(key)))
    .map(([key]) => decode(key));
}
