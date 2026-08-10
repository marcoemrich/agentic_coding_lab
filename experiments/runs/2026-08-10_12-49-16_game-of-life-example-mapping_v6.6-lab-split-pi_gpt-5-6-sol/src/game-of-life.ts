export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const living = new Set(currentGeneration.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentGeneration) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = keyOf([x + dx, y + dy]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) =>
      count === REPRODUCTION_NEIGHBOR_COUNT
      || (count === SURVIVAL_NEIGHBOR_COUNT && living.has(key)))
    .map(([key]) => key.split(",").map(Number) as Cell);
}
