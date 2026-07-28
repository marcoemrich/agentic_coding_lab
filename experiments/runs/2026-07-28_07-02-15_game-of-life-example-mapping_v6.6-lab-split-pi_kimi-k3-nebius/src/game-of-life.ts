export type Cell = [number, number]; // [x, y]

// Game of Life rules (B3/S23)
const MIN_SURVIVING_NEIGHBORS = 2;
const MAX_SURVIVING_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return [...survivorsIn(liveCells), ...birthsIn(liveCells)];
}

function survivorsIn(liveCells: Cell[]): Cell[] {
  return liveCells.filter((cell) =>
    survives(countLiveNeighbors(cell, liveCells)),
  );
}

function birthsIn(liveCells: Cell[]): Cell[] {
  const candidates = uniqueCells(liveCells.flatMap(neighborsOf));
  return candidates.filter((candidate) => canBeBornAt(candidate, liveCells));
}

function uniqueCells(cells: Cell[]): Cell[] {
  return cells.filter(
    (cell, index) => !containsCell(cells.slice(0, index), cell),
  );
}

function canBeBornAt(candidate: Cell, liveCells: Cell[]): boolean {
  return (
    !containsCell(liveCells, candidate) &&
    countLiveNeighbors(candidate, liveCells) === REPRODUCTION_NEIGHBOR_COUNT
  );
}

function survives(liveNeighborCount: number): boolean {
  return (
    liveNeighborCount >= MIN_SURVIVING_NEIGHBORS &&
    liveNeighborCount <= MAX_SURVIVING_NEIGHBORS
  );
}

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function containsCell(cells: Cell[], [x, y]: Cell): boolean {
  return cells.some(([cx, cy]) => cx === x && cy === y);
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) =>
    containsCell(liveCells, neighbor),
  ).length;
}
