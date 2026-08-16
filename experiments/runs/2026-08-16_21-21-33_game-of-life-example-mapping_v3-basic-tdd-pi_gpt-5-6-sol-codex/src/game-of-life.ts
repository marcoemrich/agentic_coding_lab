export type Cell = [number, number];

type Candidate = { cell: Cell; neighbors: number };
type CandidateMap = Map<string, Candidate>;

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function survives(neighbors: number): boolean {
  return neighbors >= MIN_SURVIVAL_NEIGHBORS
    && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function increment(candidates: CandidateMap, cell: Cell): void {
  const key = keyOf(cell);
  const candidate = candidates.get(key) ?? { cell, neighbors: 0 };
  candidate.neighbors += 1;
  candidates.set(key, candidate);
}

function collectCandidates(living: Map<string, Cell>): CandidateMap {
  const candidates: CandidateMap = new Map();
  for (const cell of living.values()) {
    const key = keyOf(cell);
    if (!candidates.has(key)) candidates.set(key, { cell, neighbors: 0 });
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      increment(candidates, [cell[0] + dx, cell[1] + dy]);
    }
  }
  return candidates;
}

function willLive(key: string, candidate: Candidate, living: Map<string, Cell>): boolean {
  return living.has(key)
    ? survives(candidate.neighbors)
    : candidate.neighbors === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [keyOf(cell), cell]));
  const candidates = collectCandidates(living);
  return [...candidates.entries()]
    .filter(([key, candidate]) => willLive(key, candidate, living))
    .map(([, candidate]) => candidate.cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
