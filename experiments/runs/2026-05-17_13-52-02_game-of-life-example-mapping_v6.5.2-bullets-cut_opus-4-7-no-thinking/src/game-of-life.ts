export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (alive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (alive && neighbors === 2);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const tallies = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const prev = tallies.get(key)?.count ?? 0;
      tallies.set(key, { cell: neighbor, count: prev + 1 });
    }
  }

  return [...tallies]
    .filter(([key, { count }]) => survives(liveKeys.has(key), count))
    .map(([, { cell }]) => cell);
}
