export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const BIRTH_OR_SURVIVAL_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();
  for (const key of livingCells) {
    const [x, y] = cellFromKey(key);
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighborKey = cellKey([x + offsetX, y + offsetY]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }
  return [...neighborCounts]
    .filter(([key, count]) => count === BIRTH_OR_SURVIVAL_NEIGHBORS
      || (count === MINIMUM_SURVIVAL_NEIGHBORS && livingCells.has(key)))
    .map(([key]) => cellFromKey(key));
}
