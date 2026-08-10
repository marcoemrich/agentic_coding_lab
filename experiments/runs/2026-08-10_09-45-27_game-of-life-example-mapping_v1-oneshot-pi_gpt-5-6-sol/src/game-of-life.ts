export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

type Candidate = { cell: Cell; neighbors: number };

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function addNeighbor(candidates: Map<string, Candidate>, cell: Cell): void {
  const cellKey = key(cell);
  const candidate = candidates.get(cellKey);
  if (candidate) candidate.neighbors += 1;
  else candidates.set(cellKey, { cell, neighbors: 1 });
}

function countNeighbors(liveCells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      addNeighbor(candidates, [x + dx, y + dy]);
    }
  }
  return candidates;
}

/** Computes one generation while retaining only live cells. */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = [...new Map(cells.map((cell) => [key(cell), cell])).values()];
  const liveKeys = new Set(liveCells.map(key));
  const next: Cell[] = [];
  for (const [cellKey, candidate] of countNeighbors(liveCells)) {
    const survives = liveKeys.has(cellKey)
      && candidate.neighbors >= MIN_SURVIVAL_NEIGHBORS
      && candidate.neighbors <= MAX_SURVIVAL_NEIGHBORS;
    const reproduced = !liveKeys.has(cellKey)
      && candidate.neighbors === REPRODUCTION_NEIGHBORS;
    if (survives || reproduced) next.push(candidate.cell);
  }
  return next.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}
