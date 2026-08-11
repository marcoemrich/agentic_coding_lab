export type Cell = [x: number, y: number];

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function neighboursOf([x, y]: Cell): Cell[] {
  return NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);
}

function isAlive(cell: Cell, liveCells: Cell[]): boolean {
  return liveCells.some((live) => isSameCell(live, cell));
}

function countNeighbours(cell: Cell, liveCells: Cell[]): number {
  return neighboursOf(cell).filter((neighbour) => isAlive(neighbour, liveCells))
    .length;
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

/**
 * Every cell that could possibly be alive next generation: the live cells
 * themselves, plus their neighbours. Cells further away have no live
 * neighbours, so they stay dead.
 */
function candidateCells(liveCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of [...liveCells, ...liveCells.flatMap(neighboursOf)]) {
    candidates.set(cellKey(cell), cell);
  }
  return [...candidates.values()];
}

const NEIGHBOURS_TO_BE_BORN = 3;
const NEIGHBOURS_TO_SURVIVE = 2;

function isAliveNextGeneration(cell: Cell, liveCells: Cell[]): boolean {
  const neighbours = countNeighbours(cell, liveCells);
  return (
    neighbours === NEIGHBOURS_TO_BE_BORN ||
    (neighbours === NEIGHBOURS_TO_SURVIVE && isAlive(cell, liveCells))
  );
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidateCells(liveCells).filter((cell) =>
    isAliveNextGeneration(cell, liveCells),
  );
}
