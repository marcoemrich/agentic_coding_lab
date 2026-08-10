export type Cell = [number, number];

const REPRODUCTION_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = keyOf(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(
      ([key, count]) =>
        count === REPRODUCTION_NEIGHBORS ||
        (count === SURVIVAL_NEIGHBORS && liveCells.has(key)),
    )
    .map(([key]) => key.split(",").map(Number) as Cell);
}
