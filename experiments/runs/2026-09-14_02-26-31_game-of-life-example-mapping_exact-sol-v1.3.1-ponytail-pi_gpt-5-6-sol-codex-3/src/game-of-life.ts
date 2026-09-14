export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const keyOf = ([x, y]: Cell) => `${x},${y}`;
const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) =>
      count === MAX_SURVIVAL_NEIGHBORS ||
      (count === MIN_SURVIVAL_NEIGHBORS && live.has(key))
    )
    .map(([key]) => key.split(",").map(Number) as Cell);
}
