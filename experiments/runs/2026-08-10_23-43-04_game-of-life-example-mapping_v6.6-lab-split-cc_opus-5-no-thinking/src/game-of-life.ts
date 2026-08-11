export type Cell = [number, number];

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function isNeighbor(cell: Cell, other: Cell): boolean {
  const [x, y] = cell;
  const [otherX, otherY] = other;
  return (
    !isSameCell(cell, other) &&
    Math.abs(x - otherX) <= 1 &&
    Math.abs(y - otherY) <= 1
  );
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return liveCells.filter((other) => isNeighbor(cell, other)).length;
}

function uniqueCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) => cells.findIndex((other) => isSameCell(cell, other)) === index
  );
}

function isAlive(cell: Cell, liveCells: Cell[]): boolean {
  return liveCells.some((live) => isSameCell(cell, live));
}

function neighborsOf(cell: Cell): Cell[] {
  const [x, y] = cell;
  const offsets = [-1, 0, 1];
  return offsets
    .flatMap((dx) => offsets.map((dy): Cell => [x + dx, y + dy]))
    .filter((candidate) => !isSameCell(cell, candidate));
}

// Conway's four rules, expressed as the two outcomes that produce a live cell.
// Both are total predicates: each states its own aliveness precondition, so
// either can be asked of any cell without the caller having to pre-filter.
const NEIGHBOR_COUNT_THAT_CREATES_LIFE = 3;
const LONELIEST_NEIGHBOR_COUNT_THAT_SUSTAINS_LIFE = 2;

function sustainsLife(neighborCount: number): boolean {
  return (
    neighborCount >= LONELIEST_NEIGHBOR_COUNT_THAT_SUSTAINS_LIFE &&
    neighborCount <= NEIGHBOR_COUNT_THAT_CREATES_LIFE
  );
}

function survives(cell: Cell, liveCells: Cell[]): boolean {
  return (
    isAlive(cell, liveCells) &&
    sustainsLife(countLiveNeighbors(cell, liveCells))
  );
}

function isBorn(cell: Cell, liveCells: Cell[]): boolean {
  return (
    !isAlive(cell, liveCells) &&
    countLiveNeighbors(cell, liveCells) === NEIGHBOR_COUNT_THAT_CREATES_LIFE
  );
}

// Only live cells and their immediate neighbors can be live next generation;
// every other cell is dead with 0 neighbors and stays dead.
function candidateCells(liveCells: Cell[]): Cell[] {
  return uniqueCells([...liveCells, ...liveCells.flatMap(neighborsOf)]);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidateCells(liveCells).filter(
    (cell) => survives(cell, liveCells) || isBorn(cell, liveCells)
  );
}
