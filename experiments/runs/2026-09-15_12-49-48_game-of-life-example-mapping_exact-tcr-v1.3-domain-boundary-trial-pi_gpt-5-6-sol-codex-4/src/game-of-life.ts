export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighbors: number;
};

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [-1, 0, 1];

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.flatMap((xOffset) => NEIGHBOR_OFFSETS
    .filter((yOffset) => xOffset !== 0 || yOffset !== 0)
    .map((yOffset) => [x + xOffset, y + yOffset] as Cell));
}

function candidateNeighborCounts(livingCells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const cell of livingCells.flatMap(neighboringCells)) {
    const key = coordinateKey(cell);
    const liveNeighbors = (candidates.get(key)?.liveNeighbors ?? 0) + 1;
    candidates.set(key, { cell, liveNeighbors });
  }
  return candidates;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors >= MIN_SURVIVAL_NEIGHBORS
    && liveNeighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function livesInNextGeneration(candidate: Candidate, isAlive: boolean): boolean {
  return isAlive
    ? survives(candidate.liveNeighbors)
    : candidate.liveNeighbors === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(coordinateKey));
  return [...candidateNeighborCounts(cells).entries()]
    .filter(([key, candidate]) => livesInNextGeneration(candidate, livingCellKeys.has(key)))
    .map(([, candidate]) => candidate.cell);
}
