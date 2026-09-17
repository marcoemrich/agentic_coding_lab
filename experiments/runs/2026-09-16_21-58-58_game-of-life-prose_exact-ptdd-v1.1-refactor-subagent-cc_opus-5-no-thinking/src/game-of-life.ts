export type Cell = [number, number];

const UNDERPOPULATION_THRESHOLD = 2;
const OVERPOPULATION_THRESHOLD = 3;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

function isNeighbor([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const sameCell = x === otherX && y === otherY;
  return !sameCell && Math.abs(x - otherX) <= 1 && Math.abs(y - otherY) <= 1;
}

function countLiveNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((other) => isNeighbor(cell, other)).length;
}

function survives(liveNeighbors: number): boolean {
  return (
    liveNeighbors >= UNDERPOPULATION_THRESHOLD &&
    liveNeighbors <= OVERPOPULATION_THRESHOLD
  );
}

function reproduces(liveNeighbors: number): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBOR_COUNT;
}

function neighborhoodOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) => offsets.map((dy): Cell => [x + dx, y + dy]));
}

function identityOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function candidateCells(livingCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of livingCells.flatMap(neighborhoodOf)) {
    candidates.set(identityOf(cell), cell);
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(identityOf));
  const isAlive = (cell: Cell): boolean => living.has(identityOf(cell));

  return candidateCells(cells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, cells);
    return isAlive(cell) ? survives(liveNeighbors) : reproduces(liveNeighbors);
  });
}
