export type Cell = [number, number];

const TWO_NEIGHBORS = 2;
const THREE_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const toCell = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const key of living) {
    const [x, y] = toCell(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = toKey([x + dx, y + dy]);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === THREE_NEIGHBORS
      || (count === TWO_NEIGHBORS && living.has(key)))
    .map(([key]) => toCell(key));
}
