export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighbors: number): boolean =>
  (isAlive && (neighbors === 2 || neighbors === 3)) ||
  (!isAlive && neighbors === 3);

const OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(keyOf));
  const neighborTallies = new Map<string, { cell: Cell; count: number }>();

  for (const cell of liveCells.flatMap(neighborsOf)) {
    const k = keyOf(cell);
    const prior = neighborTallies.get(k);
    neighborTallies.set(k, { cell, count: (prior?.count ?? 0) + 1 });
  }

  return [...neighborTallies]
    .filter(([k, { count }]) => survives(liveKeys.has(k), count))
    .map(([, { cell }]) => cell);
};
