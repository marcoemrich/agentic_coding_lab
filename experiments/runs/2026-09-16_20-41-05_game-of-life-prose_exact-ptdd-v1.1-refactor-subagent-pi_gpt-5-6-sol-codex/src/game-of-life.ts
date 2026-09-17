export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighborCount: number;
};

const MINIMUM_SURVIVING_LIVE_NEIGHBORS = 2;
const MAXIMUM_SURVIVING_LIVE_NEIGHBORS = 3;
const REPRODUCTION_LIVE_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function livingCellSurvives(liveNeighborCount: number): boolean {
  return liveNeighborCount >= MINIMUM_SURVIVING_LIVE_NEIGHBORS
    && liveNeighborCount <= MAXIMUM_SURVIVING_LIVE_NEIGHBORS;
}

function deadCellReproduces(liveNeighborCount: number): boolean {
  return liveNeighborCount === REPRODUCTION_LIVE_NEIGHBORS;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([offsetX, offsetY]) => [x + offsetX, y + offsetY]);
}

function neighborCandidates(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const livingCell of cells) {
    for (const cell of neighboringCells(livingCell)) {
      const key = cellKey(cell);
      const liveNeighborCount = (candidates.get(key)?.liveNeighborCount ?? 0) + 1;
      candidates.set(key, { cell, liveNeighborCount });
    }
  }
  return candidates;
}

function willLive(currentlyLiving: boolean, liveNeighborCount: number): boolean {
  return currentlyLiving
    ? livingCellSurvives(liveNeighborCount)
    : deadCellReproduces(liveNeighborCount);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return [...neighborCandidates(cells).entries()]
    .filter(([key, candidate]) => willLive(livingCellKeys.has(key), candidate.liveNeighborCount))
    .map(([, candidate]) => candidate.cell);
}
