export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const tally = new Map<string, { cell: Cell; count: number }>();

  for (const neighbor of cells.flatMap(neighborsOf)) {
    const key = cellKey(neighbor);
    const prior = tally.get(key)?.count ?? 0;
    tally.set(key, { cell: neighbor, count: prior + 1 });
  }

  return [...tally.entries()]
    .filter(([key, { count }]) => survives(aliveKeys.has(key), count))
    .map(([, { cell }]) => cell);
}
