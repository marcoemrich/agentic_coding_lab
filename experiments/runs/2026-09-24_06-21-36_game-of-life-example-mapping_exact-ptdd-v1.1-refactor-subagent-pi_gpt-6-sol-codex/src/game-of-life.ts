export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;

function survives(liveNeighborCount: number): boolean {
  return liveNeighborCount >= MIN_SURVIVAL_NEIGHBORS && liveNeighborCount <= MAX_SURVIVAL_NEIGHBORS;
}

function sameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function areNeighbors(cell: Cell, other: Cell): boolean {
  return !sameCell(cell, other) &&
    Math.abs(other[0] - cell[0]) <= 1 && Math.abs(other[1] - cell[1]) <= 1;
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter(other => areNeighbors(cell, other)).length;
}

const NEIGHBOR_OFFSETS = [-1, 0, 1];
const REPRODUCTION_NEIGHBORS = 3;

function reproduces(liveNeighborCount: number): boolean {
  return liveNeighborCount === REPRODUCTION_NEIGHBORS;
}

function candidateCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const dx of NEIGHBOR_OFFSETS) {
      for (const dy of NEIGHBOR_OFFSETS) {
        const candidate: Cell = [x + dx, y + dy];
        candidates.set(candidate.join(","), candidate);
      }
    }
  }
  return [...candidates.values()];
}

function livesInNextGeneration(cell: Cell, cells: Cell[]): boolean {
  const neighbors = countLiveNeighbors(cell, cells);
  const alive = cells.some(live => sameCell(live, cell));
  return alive ? survives(neighbors) : reproduces(neighbors);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return candidateCells(cells).filter(cell => livesInNextGeneration(cell, cells));
}
