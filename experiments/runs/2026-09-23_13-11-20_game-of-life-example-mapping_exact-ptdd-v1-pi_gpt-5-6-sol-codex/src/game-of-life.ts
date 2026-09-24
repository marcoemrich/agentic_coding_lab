export type Cell = [number, number];

type Candidate = { cell: Cell; liveNeighbors: number };

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([xOffset, yOffset]) => [x + xOffset, y + yOffset]);
}

function countNeighborsForCandidates(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const candidate = candidates.get(key) ?? { cell: neighbor, liveNeighbors: 0 };
      candidate.liveNeighbors += 1;
      candidates.set(key, candidate);
    }
  }
  return candidates;
}

function survives(candidate: Candidate): boolean {
  return candidate.liveNeighbors >= MINIMUM_SURVIVAL_NEIGHBORS
    && candidate.liveNeighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function reproduces(candidate: Candidate): boolean {
  return candidate.liveNeighbors === REPRODUCTION_NEIGHBORS;
}

function willLive(key: string, candidate: Candidate, livingKeys: Set<string>): boolean {
  const isAlive = livingKeys.has(key);
  return (isAlive && survives(candidate)) || (!isAlive && reproduces(candidate));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(cellKey));
  const candidates = countNeighborsForCandidates(cells);
  return [...candidates]
    .filter(([key, candidate]) => willLive(key, candidate, livingKeys))
    .map(([, candidate]) => candidate.cell);
}
