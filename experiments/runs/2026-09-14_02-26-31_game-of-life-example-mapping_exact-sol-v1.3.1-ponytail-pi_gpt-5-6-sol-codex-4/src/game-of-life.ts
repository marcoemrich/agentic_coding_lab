export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];
const key = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();
  for (const coordinate of living) {
    const [x, y] = coordinate.split(",").map(Number);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = key(x + dx, y + dy);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }
  return [...neighborCounts]
    .filter(([coordinate, count]) => count === BIRTH_NEIGHBORS || count === SURVIVAL_NEIGHBORS && living.has(coordinate))
    .map(([coordinate]) => coordinate.split(",").map(Number) as Cell);
}
