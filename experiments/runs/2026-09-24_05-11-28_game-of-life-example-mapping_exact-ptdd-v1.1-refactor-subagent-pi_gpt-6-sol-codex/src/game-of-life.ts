export type Cell = [number, number];

function sameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function adjacentCells([x, y]: Cell): Cell[] {
  const adjacent: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) adjacent.push([x + dx, y + dy]);
    }
  }
  return adjacent;
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  const adjacent = adjacentCells(cell);
  return cells.filter(otherCell => adjacent.some(neighbor => sameCell(neighbor, otherCell))).length;
}

function isOverpopulated(neighbors: number): boolean {
  const maximumSurvivalNeighbors = 3;
  return neighbors > maximumSurvivalNeighbors;
}

function isUnderpopulated(neighbors: number): boolean {
  const minimumSurvivalNeighbors = 2;
  return neighbors < minimumSurvivalNeighbors;
}

function survives(cell: Cell, cells: Cell[]): boolean {
  const neighbors = countLiveNeighbors(cell, cells);
  return !isUnderpopulated(neighbors) && !isOverpopulated(neighbors);
}

function birthCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of adjacentCells(cell)) {
      if (!cells.some(live => sameCell(live, candidate))) {
        candidates.set(JSON.stringify(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

function hasReproductionNeighbors(cell: Cell, cells: Cell[]): boolean {
  const reproductionNeighbors = 3;
  return countLiveNeighbors(cell, cells) === reproductionNeighbors;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(cell => survives(cell, cells));
  const births = birthCandidates(cells).filter(cell => hasReproductionNeighbors(cell, cells));
  return [...survivors, ...births];
}
