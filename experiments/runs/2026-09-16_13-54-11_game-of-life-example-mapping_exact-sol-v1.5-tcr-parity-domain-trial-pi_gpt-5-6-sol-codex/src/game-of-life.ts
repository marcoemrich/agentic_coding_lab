export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const COORDINATE_OFFSETS = [-1, 0, 1] as const;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const sharesCoordinate = x === otherX && y === otherY;
  return !sharesCoordinate
    && Math.abs(x - otherX) <= 1
    && Math.abs(y - otherY) <= 1;
}

function survives(liveNeighborCount: number): boolean {
  return liveNeighborCount >= MIN_SURVIVAL_NEIGHBORS
    && liveNeighborCount <= MAX_SURVIVAL_NEIGHBORS;
}

function livesInNextGeneration(
  isCurrentlyAlive: boolean,
  liveNeighborCount: number,
): boolean {
  return isCurrentlyAlive
    ? survives(liveNeighborCount)
    : liveNeighborCount === REPRODUCTION_NEIGHBORS;
}

function generationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const xOffset of COORDINATE_OFFSETS) {
      for (const yOffset of COORDINATE_OFFSETS) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return generationCandidates(cells).filter((candidate) => {
    const liveNeighborCount = cells.filter(
      (cell) => areNeighbors(candidate, cell),
    ).length;
    return livesInNextGeneration(
      livingCellKeys.has(cellKey(candidate)),
      liveNeighborCount,
    );
  });
}
