export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighborCount: number;
};

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${String(x)},${String(y)}`;
}

function countCandidate(candidates: Map<string, Candidate>, [x, y]: Cell, [dx, dy]: Cell): void {
  const cell: Cell = [x + dx, y + dy];
  const key = cellKey(cell);
  const candidate = candidates.get(key);
  if (candidate === undefined) {
    candidates.set(key, { cell, neighborCount: 1 });
    return;
  }
  candidate.neighborCount += 1;
}

function livesNext(key: string, candidate: Candidate, living: Set<string>): boolean {
  return candidate.neighborCount === REPRODUCTION_NEIGHBOR_COUNT ||
    (candidate.neighborCount === SURVIVAL_NEIGHBOR_COUNT && living.has(key));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();
  for (const cell of cells) {
    for (const offset of NEIGHBOR_OFFSETS) {
      countCandidate(candidates, cell, offset);
    }
  }
  return [...candidates]
    .filter(([key, candidate]) => livesNext(key, candidate, living))
    .map(([, candidate]) => candidate.cell);
}
