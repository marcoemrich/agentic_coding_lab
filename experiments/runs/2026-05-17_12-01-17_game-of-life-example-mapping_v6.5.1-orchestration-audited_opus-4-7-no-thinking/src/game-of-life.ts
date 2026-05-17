export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (count: number, isAlive: boolean): boolean =>
  count === 3 || (count === 2 && isAlive);

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Cell>();
  const counts = new Map<string, number>();

  for (const cell of liveCells.flatMap(neighborsOf)) {
    const key = cellKey(cell);
    candidates.set(key, cell);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...candidates]
    .filter(([key, _]) => survives(counts.get(key)!, liveSet.has(key)))
    .map(([_, cell]) => cell);
}
