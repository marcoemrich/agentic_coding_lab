export type Cell = [number, number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const survivors = livingCells.filter((cell) => survives(cell, livingCells));
  const births = deadCellsAdjacentToLife(livingCells).filter((cell) => isBorn(cell, livingCells));
  return [...survivors, ...births];
}

function survives(cell: Cell, livingCells: Cell[]): boolean {
  const neighbors = countLivingNeighbors(cell, livingCells);
  return neighbors >= MIN_NEIGHBORS_TO_SURVIVE && neighbors <= MAX_NEIGHBORS_TO_SURVIVE;
}

function isBorn(cell: Cell, livingCells: Cell[]): boolean {
  return countLivingNeighbors(cell, livingCells) === NEIGHBORS_TO_BE_BORN;
}

function deadCellsAdjacentToLife(livingCells: Cell[]): Cell[] {
  const adjacent = distinctCells(livingCells.flatMap(neighborsOf));
  return adjacent.filter((cell) => !isLiving(cell, livingCells));
}

function isLiving(cell: Cell, livingCells: Cell[]): boolean {
  return livingCells.some((livingCell) => isSameCell(livingCell, cell));
}

function distinctCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) => cells.findIndex((other) => isSameCell(other, cell)) === index,
  );
}

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets
    .flatMap((dx) => offsets.map((dy): Cell => [x + dx, y + dy]))
    .filter((cell) => !isSameCell(cell, [x, y]));
}

function countLivingNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((livingCell) => isNeighborOf(livingCell, cell)).length;
}

function isNeighborOf(cell: Cell, other: Cell): boolean {
  return neighborsOf(other).some((neighbor) => isSameCell(neighbor, cell));
}

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}
