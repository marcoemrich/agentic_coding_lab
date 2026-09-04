export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidateCells(liveCells).filter((cell) =>
    isAliveNextGeneration(cell, liveCells),
  );
}

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

function isAliveNextGeneration(cell: Cell, liveCells: Cell[]): boolean {
  const liveNeighborCount = countLiveNeighbors(cell, liveCells);
  if (isAlive(cell, liveCells)) return survives(liveNeighborCount);
  return liveNeighborCount === NEIGHBORS_TO_BE_BORN;
}

function survives(liveNeighborCount: number): boolean {
  return (
    liveNeighborCount >= MIN_NEIGHBORS_TO_SURVIVE &&
    liveNeighborCount <= MAX_NEIGHBORS_TO_SURVIVE
  );
}

function candidateCells(liveCells: Cell[]): Cell[] {
  return deduplicate(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => isAlive(neighbor, liveCells))
    .length;
}

function isAlive(cell: Cell, liveCells: Cell[]): boolean {
  return liveCells.some((other) => isSameCell(cell, other));
}

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function deduplicate(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [key(cell), cell])).values()];
}

function key([x, y]: Cell): string {
  return `${x},${y}`;
}
