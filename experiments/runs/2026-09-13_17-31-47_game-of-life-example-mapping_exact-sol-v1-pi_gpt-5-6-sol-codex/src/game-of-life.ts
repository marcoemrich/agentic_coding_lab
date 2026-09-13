export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighbors: number;
};

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function countCandidateNeighbors(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + xOffset, y + yOffset];
      const key = keyOf(cell);
      const candidate = candidates.get(key) ?? { cell, neighbors: 0 };
      candidate.neighbors += 1;
      candidates.set(key, candidate);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(keyOf));
  return [...countCandidateNeighbors(cells).entries()]
    .filter(([key, { neighbors }]) => neighbors === REPRODUCTION_NEIGHBORS
      || (neighbors === SURVIVAL_NEIGHBORS && livingCells.has(key)))
    .map(([, { cell }]) => cell);
}
