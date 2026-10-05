export type Cell = [number, number];

const neighborhoodRadius = 1;

function isNeighborOffset(dx: number, dy: number): boolean {
  return Math.abs(dx) <= neighborhoodRadius && Math.abs(dy) <= neighborhoodRadius &&
    (dx !== 0 || dy !== 0);
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return isNeighborOffset(x - otherX, y - otherY);
}

function survives(liveNeighborCount: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return liveNeighborCount === minimumSurvivalNeighbors ||
    liveNeighborCount === maximumSurvivalNeighbors;
}

function reproduces(liveNeighborCount: number): boolean {
  const reproductionNeighbors = 3;
  return liveNeighborCount === reproductionNeighbors;
}

function countLiveNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter(other => areNeighbors(cell, other)).length;
}

function surroundingCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -neighborhoodRadius; dx <= neighborhoodRadius; dx++) {
    for (let dy = -neighborhoodRadius; dy <= neighborhoodRadius; dy++) {
      if (isNeighborOffset(dx, dy)) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function isLiving(cell: Cell, livingCells: Cell[]): boolean {
  return livingCells.some(living => living[0] === cell[0] && living[1] === cell[1]);
}

function coordinateKey(cell: Cell): string {
  return JSON.stringify(cell);
}

function neighboringCells(livingCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of livingCells.flatMap(surroundingCells)) {
    candidates.set(coordinateKey(cell), cell);
  }
  return [...candidates.values()];
}

function deadNeighborCells(livingCells: Cell[]): Cell[] {
  return neighboringCells(livingCells).filter(cell => !isLiving(cell, livingCells));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(cell => survives(countLiveNeighbors(cell, cells)));
  const births = deadNeighborCells(cells).filter(cell =>
    reproduces(countLiveNeighbors(cell, cells)));
  return [...survivors, ...births];
}
