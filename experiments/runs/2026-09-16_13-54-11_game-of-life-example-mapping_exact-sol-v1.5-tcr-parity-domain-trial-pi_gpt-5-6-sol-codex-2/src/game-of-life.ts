export type Cell = [number, number];

type NeighborCandidate = { cell: Cell; liveNeighbors: number };

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([xOffset, yOffset]) => [x + xOffset, y + yOffset]);
}

function countNeighborCandidates(cells: Cell[]): Map<string, NeighborCandidate> {
  const candidates = new Map<string, NeighborCandidate>();
  for (const cell of cells) {
    for (const neighbor of neighborCells(cell)) {
      const key = cellKey(neighbor);
      const liveNeighbors = (candidates.get(key)?.liveNeighbors ?? 0) + 1;
      candidates.set(key, { cell: neighbor, liveNeighbors });
    }
  }
  return candidates;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors >= MIN_SURVIVAL_NEIGHBORS && liveNeighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(liveNeighbors: number): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBORS;
}

function livesInNextGeneration(isAlive: boolean, liveNeighbors: number): boolean {
  return isBorn(liveNeighbors) || isAlive && survives(liveNeighbors);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  return [...countNeighborCandidates(cells).entries()]
    .filter(([key, candidate]) => livesInNextGeneration(
      livingCells.has(key), candidate.liveNeighbors,
    ))
    .map(([, candidate]) => candidate.cell);
}
