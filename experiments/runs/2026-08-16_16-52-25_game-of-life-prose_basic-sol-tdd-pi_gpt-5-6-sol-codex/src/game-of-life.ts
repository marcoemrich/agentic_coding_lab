export type Cell = [number, number];

type NeighborTally = {
  cell: Cell;
  count: number;
};

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const MAX_SURVIVAL_NEIGHBORS = REPRODUCTION_NEIGHBORS;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function tallyNeighbors(cells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      tallies.set(key, { cell, count: (tallies.get(key)?.count ?? 0) + 1 });
    }
  }
  return tallies;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return [...tallyNeighbors(cells).entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBORS ||
      (livingCellKeys.has(key) &&
        count >= MIN_SURVIVAL_NEIGHBORS &&
        count <= MAX_SURVIVAL_NEIGHBORS),
    )
    .map(([, { cell }]) => cell);
}
