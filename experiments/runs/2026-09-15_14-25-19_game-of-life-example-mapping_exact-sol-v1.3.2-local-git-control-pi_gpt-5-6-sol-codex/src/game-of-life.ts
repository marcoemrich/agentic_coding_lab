export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellFrom = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const key of living) {
    const [x, y] = cellFrom(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === REPRODUCTION_NEIGHBORS
      || (count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([key]) => cellFrom(key));
}
