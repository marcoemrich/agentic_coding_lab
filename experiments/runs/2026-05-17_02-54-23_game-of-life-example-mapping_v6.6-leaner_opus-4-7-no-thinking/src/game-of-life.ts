export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const liveNeighbors = (cell: Cell, alive: Set<string>): number =>
  neighborsOf(cell).filter((n) => alive.has(keyOf(n))).length;

const survives = (isAlive: boolean, count: number): boolean =>
  isAlive ? count === 2 || count === 3 : count === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const candidates = new Map(
    cells.flatMap((cell) => [cell, ...neighborsOf(cell)]).map((c) => [keyOf(c), c])
  );

  return [...candidates.values()].filter((cell) =>
    survives(alive.has(keyOf(cell)), liveNeighbors(cell, alive))
  );
}
