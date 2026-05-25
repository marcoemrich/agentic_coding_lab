export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const coordKey = ([x, y]: Cell): string => `${x},${y}`;

const survivesToNextGeneration = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(coordKey));
  const neighborTallies = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = coordKey(neighbor);
      const tally = neighborTallies.get(key) ?? { cell: neighbor, count: 0 };
      tally.count++;
      neighborTallies.set(key, tally);
    }
  }

  return [...neighborTallies.entries()]
    .filter(([key, { count }]) => survivesToNextGeneration(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
