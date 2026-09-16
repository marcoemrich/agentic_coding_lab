export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
    for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
      if (deltaX !== 0 || deltaY !== 0) neighbors.push([x + deltaX, y + deltaY]);
    }
  }
  return neighbors;
}

function countLiveNeighbors(cell: Cell, livingCellKeys: Set<string>): number {
  return neighboringCells(cell).filter((neighbor) => livingCellKeys.has(cellKey(neighbor))).length;
}

function canSurvive(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
    && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function willBeAlive(currentlyAlive: boolean, neighborCount: number): boolean {
  return currentlyAlive
    ? canSurvive(neighborCount)
    : neighborCount === REPRODUCTION_NEIGHBORS;
}

function candidateCells(cells: Cell[]): Map<string, Cell> {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighboringCells(cell)) candidates.set(cellKey(neighbor), neighbor);
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return [...candidateCells(cells)].filter(([key, cell]) =>
    willBeAlive(livingCellKeys.has(key), countLiveNeighbors(cell, livingCellKeys))
  ).map(([, cell]) => cell);
}
