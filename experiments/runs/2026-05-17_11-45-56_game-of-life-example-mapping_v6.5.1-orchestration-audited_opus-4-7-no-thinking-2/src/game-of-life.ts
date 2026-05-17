export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (alive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (alive && neighbors === 2);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(keyOf));
  const tally = new Map<string, [Cell, number]>();
  for (const cell of cells.flatMap(neighborsOf)) {
    const key = keyOf(cell);
    tally.set(key, [cell, (tally.get(key)?.[1] ?? 0) + 1]);
  }
  return [...tally].filter(([key, [, count]]) => survives(live.has(key), count))
                   .map(([, [cell]]) => cell);
}
