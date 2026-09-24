export type Cell = [number, number];

const NEIGHBORHOOD_RADIUS = 1;
const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(x - otherX) <= NEIGHBORHOOD_RADIUS && Math.abs(y - otherY) <= NEIGHBORHOOD_RADIUS &&
    (x !== otherX || y !== otherY);
}

function liveNeighborCount(cell: Cell, cells: Cell[]): number {
  return cells.filter((otherCell) => areNeighbors(cell, otherCell)).length;
}

function survivesWithNeighbors(neighbors: number): boolean {
  return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function reproducesWithNeighbors(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
}

function cellsAtOrAdjacentTo([x, y]: Cell): Cell[] {
  const neighborhood: Cell[] = [];
  for (let dx = -NEIGHBORHOOD_RADIUS; dx <= NEIGHBORHOOD_RADIUS; dx++) {
    for (let dy = -NEIGHBORHOOD_RADIUS; dy <= NEIGHBORHOOD_RADIUS; dy++) {
      neighborhood.push([x + dx, y + dy]);
    }
  }
  return neighborhood;
}

function uniqueCells(cells: Cell[]): Cell[] {
  const byCoordinate = new Map<string, Cell>();
  for (const cell of cells) {
    byCoordinate.set(JSON.stringify(cell), cell);
  }
  return [...byCoordinate.values()];
}

function candidateCells(cells: Cell[]): Cell[] {
  return uniqueCells(cells.flatMap(cellsAtOrAdjacentTo));
}

function isLivingCell(cell: Cell, cells: Cell[]): boolean {
  return cells.some(([x, y]) => x === cell[0] && y === cell[1]);
}

function livesInNextGeneration(cell: Cell, cells: Cell[]): boolean {
  const neighbors = liveNeighborCount(cell, cells);
  return isLivingCell(cell, cells)
    ? survivesWithNeighbors(neighbors)
    : reproducesWithNeighbors(neighbors);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return candidateCells(cells).filter((cell) => livesInNextGeneration(cell, cells));
}
