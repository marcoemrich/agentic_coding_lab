export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  const neighborTallies = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const tally = neighborTallies.get(key);
      neighborTallies.set(key, { cell: neighbor, count: (tally?.count ?? 0) + 1 });
    }
  }

  return [...neighborTallies]
    .filter(([key, { count }]) => survives(liveCells.has(key), count))
    .map(([, { cell }]) => cell);
}
