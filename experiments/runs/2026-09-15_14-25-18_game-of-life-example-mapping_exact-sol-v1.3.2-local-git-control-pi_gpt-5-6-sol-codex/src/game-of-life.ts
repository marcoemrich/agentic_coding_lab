export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

type NeighborCount = { cell: Cell; count: number };

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([offsetX, offsetY]) => [x + offsetX, y + offsetY]);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, NeighborCount>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      const current = neighborCounts.get(key);
      neighborCounts.set(key, { cell: neighbor, count: (current?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBORS ||
      (count === SURVIVAL_NEIGHBORS && living.has(key)),
    )
    .map(([, { cell }]) => cell);
}
