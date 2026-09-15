export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
    for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      if (xOffset !== 0 || yOffset !== 0) neighbors.push([x + xOffset, y + yOffset]);
    }
  }
  return neighbors;
}

function liveNeighborCount(cell: Cell, livingCells: Set<string>): number {
  return neighboringCells(cell).filter((neighbor) => livingCells.has(cellKey(neighbor))).length;
}

function hasSurvivalNeighborCount(cell: Cell, livingCells: Set<string>): boolean {
  const neighborCount = liveNeighborCount(cell, livingCells);
  return neighborCount >= MIN_SURVIVAL_NEIGHBORS && neighborCount <= MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(cell: Cell, livingCells: Set<string>): boolean {
  return !livingCells.has(cellKey(cell))
    && liveNeighborCount(cell, livingCells) === REPRODUCTION_NEIGHBOR_COUNT;
}

function possibleBirthCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  cells.flatMap(neighboringCells).forEach((cell) => candidates.set(cellKey(cell), cell));
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => hasSurvivalNeighborCount(cell, livingCells));
  const births = possibleBirthCells(cells).filter((cell) => isBorn(cell, livingCells));
  return [...survivors, ...births];
}
