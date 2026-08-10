export type Cell = [number, number];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

const SURVIVAL_NEIGHBOR_COUNT = 2;
const BIRTH_NEIGHBOR_COUNT = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const living = new Set(currentGeneration.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentGeneration) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = coordinateKey(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === BIRTH_NEIGHBOR_COUNT ||
        (count === SURVIVAL_NEIGHBOR_COUNT && living.has(key))) {
      const [x, y] = key.split(",").map(Number);
      next.push([x, y]);
    }
  }
  return next;
}
