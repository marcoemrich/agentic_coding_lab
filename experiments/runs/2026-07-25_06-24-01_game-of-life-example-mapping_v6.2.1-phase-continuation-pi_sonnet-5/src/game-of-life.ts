export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

const NEIGHBOR_OFFSETS: Array<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function neighborsOf(x: number, y: number): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(liveCells: Set<string>, x: number, y: number): number {
  return neighborsOf(x, y).filter(([nx, ny]) => liveCells.has(cellKey(nx, ny))).length;
}

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_REPRODUCE = 3;

function survives(liveNeighborCount: number): boolean {
  return (
    liveNeighborCount === MIN_NEIGHBORS_TO_SURVIVE ||
    liveNeighborCount === MAX_NEIGHBORS_TO_SURVIVE
  );
}

function reproduces(liveNeighborCount: number): boolean {
  return liveNeighborCount === NEIGHBORS_TO_REPRODUCE;
}

function willBeAlive(isAlive: boolean, liveNeighborCount: number): boolean {
  return isAlive ? survives(liveNeighborCount) : reproduces(liveNeighborCount);
}

function collectCandidates(cells: Cell[]): Map<string, Cell> {
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    candidates.set(cellKey(x, y), [x, y]);
    for (const neighbor of neighborsOf(x, y)) {
      candidates.set(cellKey(...neighbor), neighbor);
    }
  }

  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const candidates = collectCandidates(cells);

  const nextGenerationCells: Cell[] = [];

  for (const [candidateKey, cell] of candidates) {
    const [x, y] = cell;
    const liveNeighborCount = countLiveNeighbors(liveCells, x, y);
    const isAlive = liveCells.has(candidateKey);

    if (willBeAlive(isAlive, liveNeighborCount)) {
      nextGenerationCells.push(cell);
    }
  }

  return nextGenerationCells;
}
