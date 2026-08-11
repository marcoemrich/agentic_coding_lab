export type Cell = [number, number];

const FEWEST_NEIGHBOURS_TO_SURVIVE = 2;
const MOST_NEIGHBOURS_TO_SURVIVE = 3;
const NEIGHBOURS_TO_BE_BORN = MOST_NEIGHBOURS_TO_SURVIVE;

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function areNeighbours(cell: Cell, other: Cell): boolean {
  const [x, y] = cell;
  const [otherX, otherY] = other;
  const isTouching = Math.abs(otherX - x) <= 1 && Math.abs(otherY - y) <= 1;
  return isTouching && !isSameCell(cell, other);
}

function countLivingNeighbours(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((living) => areNeighbours(cell, living)).length;
}

function survives(cell: Cell, livingCells: Cell[]): boolean {
  const livingNeighbours = countLivingNeighbours(cell, livingCells);
  return (
    livingNeighbours >= FEWEST_NEIGHBOURS_TO_SURVIVE &&
    livingNeighbours <= MOST_NEIGHBOURS_TO_SURVIVE
  );
}

function isBorn(cell: Cell, livingCells: Cell[]): boolean {
  return countLivingNeighbours(cell, livingCells) === NEIGHBOURS_TO_BE_BORN;
}

function neighboursOf(cell: Cell): Cell[] {
  const [x, y] = cell;
  const offsets = [-1, 0, 1];
  const surroundingBlock = offsets.flatMap((dx) =>
    offsets.map((dy): Cell => [x + dx, y + dy]),
  );
  return surroundingBlock.filter((candidate) => !isSameCell(candidate, cell));
}

function distinctCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(other, cell)) === index,
  );
}

function isDead(cell: Cell, livingCells: Cell[]): boolean {
  return !livingCells.some((living) => isSameCell(living, cell));
}

function deadNeighboursOf(livingCells: Cell[]): Cell[] {
  const neighbours = livingCells.flatMap(neighboursOf);
  return distinctCells(neighbours.filter((cell) => isDead(cell, livingCells)));
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const survivors = livingCells.filter((cell) => survives(cell, livingCells));
  const births = deadNeighboursOf(livingCells).filter((cell) =>
    isBorn(cell, livingCells),
  );

  return [...survivors, ...births];
}
