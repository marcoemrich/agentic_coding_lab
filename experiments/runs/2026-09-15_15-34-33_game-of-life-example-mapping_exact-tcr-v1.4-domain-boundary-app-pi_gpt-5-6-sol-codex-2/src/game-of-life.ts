export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey(cell: Cell): string {
  return String(cell);
}

function isNeighbor([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const xDistance = Math.abs(x - otherX);
  const yDistance = Math.abs(y - otherY);
  return xDistance <= 1 && yDistance <= 1 && xDistance + yDistance > 0;
}

function liveNeighborCount(cell: Cell, cells: Cell[]): number {
  return cells.filter((candidate) => isNeighbor(cell, candidate)).length;
}

function survives(cell: Cell, cells: Cell[]): boolean {
  const neighbors = liveNeighborCount(cell, cells);
  return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([xOffset, yOffset]) => [x + xOffset, y + yOffset]);
}

function isBorn(cell: Cell, cells: Cell[], living: Set<string>): boolean {
  return !living.has(cellKey(cell)) && liveNeighborCount(cell, cells) === REPRODUCTION_NEIGHBORS;
}

function reproductionCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  cells.flatMap(neighboringCells).forEach((cell) => candidates.set(cellKey(cell), cell));
  const living = new Set(cells.map(cellKey));
  return [...candidates.values()].filter((cell) => isBorn(cell, cells, living));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return [...cells.filter((cell) => survives(cell, cells)), ...reproductionCandidates(cells)];
}
