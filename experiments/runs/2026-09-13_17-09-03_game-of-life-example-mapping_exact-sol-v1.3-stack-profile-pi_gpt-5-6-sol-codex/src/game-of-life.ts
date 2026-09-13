export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

type Candidate = { cell: Cell; neighbors: number };

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function countCandidates(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + deltaX, y + deltaY];
      const key = cellKey(cell);
      const neighbors = (candidates.get(key)?.neighbors ?? 0) + 1;
      candidates.set(key, { cell, neighbors });
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  return [...countCandidates(cells).entries()]
    .filter(([key, { neighbors }]) =>
      neighbors === REPRODUCTION_NEIGHBORS ||
      (neighbors === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([, { cell }]) => cell);
}
