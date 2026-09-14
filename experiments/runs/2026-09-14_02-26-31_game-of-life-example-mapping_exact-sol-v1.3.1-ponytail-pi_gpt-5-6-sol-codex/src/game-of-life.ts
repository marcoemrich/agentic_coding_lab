type Cell = [number, number];

const BIRTH_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellOf = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const key of live) {
    const [x, y] = cellOf(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = keyOf([x + dx, y + dy]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === BIRTH_NEIGHBORS ||
      (count === SURVIVAL_NEIGHBORS && live.has(key)))
    .map(([key]) => cellOf(key));
}
