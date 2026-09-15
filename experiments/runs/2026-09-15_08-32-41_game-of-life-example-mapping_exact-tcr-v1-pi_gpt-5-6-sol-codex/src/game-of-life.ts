export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

type Candidate = { cell: Cell; neighbors: number };

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const neighbors = (candidates.get(key)?.neighbors ?? 0) + 1;
      candidates.set(key, { cell, neighbors });
    }
  }

  return [...candidates.entries()]
    .filter(([key, { neighbors }]) => neighbors === REPRODUCTION_NEIGHBORS
      || (living.has(key)
        && neighbors >= MINIMUM_SURVIVAL_NEIGHBORS
        && neighbors <= MAXIMUM_SURVIVAL_NEIGHBORS))
    .map(([, { cell }]) => cell);
}
