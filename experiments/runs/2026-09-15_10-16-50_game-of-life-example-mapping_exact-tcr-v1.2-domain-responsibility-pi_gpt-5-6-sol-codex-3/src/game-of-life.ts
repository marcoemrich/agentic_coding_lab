export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.max(Math.abs(x - otherX), Math.abs(y - otherY)) === 1;
}

function countLiveNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((candidate) => areNeighbors(cell, candidate)).length;
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MIN_SURVIVAL_NEIGHBORS && neighborCount <= MAX_SURVIVAL_NEIGHBORS;
}

function reproduces(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS;
}

function collectCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const xOffset of NEIGHBOR_OFFSETS) {
      for (const yOffset of NEIGHBOR_OFFSETS) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell, cells)));
  const births = collectCandidates(cells).filter(
    (cell) => !livingKeys.has(cellKey(cell)) && reproduces(countLiveNeighbors(cell, cells)),
  );
  return [...survivors, ...births];
}
