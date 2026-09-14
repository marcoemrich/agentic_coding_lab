export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const previous = neighborCounts.get(key);
      neighborCounts.set(key, { cell: neighbor, count: (previous?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === REPRODUCTION_NEIGHBORS
      || (count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([, { cell }]) => cell);
}
