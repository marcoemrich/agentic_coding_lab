export type Cell = [number, number];

const BIRTH_NEIGHBOUR_COUNT = 3;
const MIN_SURVIVING_NEIGHBOUR_COUNT = 2;
const SURVIVING_NEIGHBOUR_COUNTS = [
  MIN_SURVIVING_NEIGHBOUR_COUNT,
  BIRTH_NEIGHBOUR_COUNT,
];

/** One step in each direction along an axis, including no step at all. */
const NEIGHBOUR_OFFSETS = [-1, 0, 1];

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function isAdjacent([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(otherX - x) <= 1 && Math.abs(otherY - y) <= 1;
}

function isNeighbourOf(cell: Cell, other: Cell): boolean {
  return isAdjacent(cell, other) && !isSameCell(cell, other);
}

function countLivingNeighbours(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((other) => isNeighbourOf(cell, other)).length;
}

function survives(cell: Cell, livingCells: Cell[]): boolean {
  return SURVIVING_NEIGHBOUR_COUNTS.includes(
    countLivingNeighbours(cell, livingCells),
  );
}

function isBorn(cell: Cell, livingCells: Cell[]): boolean {
  return countLivingNeighbours(cell, livingCells) === BIRTH_NEIGHBOUR_COUNT;
}

function isAlive(cell: Cell, livingCells: Cell[]): boolean {
  return livingCells.some((living) => isSameCell(cell, living));
}

/** The 3x3 block centred on the cell: the cell itself plus its 8 neighbours. */
function cellAndItsNeighbours([x, y]: Cell): Cell[] {
  return NEIGHBOUR_OFFSETS.flatMap((dx) =>
    NEIGHBOUR_OFFSETS.map((dy): Cell => [x + dx, y + dy]),
  );
}

function positionKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function deduplicateByPosition(cells: Cell[]): Cell[] {
  const byPosition = new Map(cells.map((cell) => [positionKey(cell), cell]));
  return [...byPosition.values()];
}

function cellsThatCouldBeAliveNext(livingCells: Cell[]): Cell[] {
  return deduplicateByPosition(livingCells.flatMap(cellAndItsNeighbours));
}

function isAliveNextGeneration(cell: Cell, livingCells: Cell[]): boolean {
  return isAlive(cell, livingCells)
    ? survives(cell, livingCells)
    : isBorn(cell, livingCells);
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  return cellsThatCouldBeAliveNext(livingCells).filter((cell) =>
    isAliveNextGeneration(cell, livingCells),
  );
}
