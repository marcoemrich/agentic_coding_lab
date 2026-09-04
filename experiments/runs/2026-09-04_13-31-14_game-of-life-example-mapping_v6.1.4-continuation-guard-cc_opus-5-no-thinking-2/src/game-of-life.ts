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

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function contains(cells: Cell[], cell: Cell): boolean {
  return cells.some((candidate) => isSameCell(candidate, cell));
}

function withoutDuplicates(cells: Cell[]): Cell[] {
  return cells.filter((cell, index) => !contains(cells.slice(0, index), cell));
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => contains(liveCells, neighbor))
    .length;
}

function livesOn(cell: Cell, liveCells: Cell[]): boolean {
  const liveNeighborCount = countLiveNeighbors(cell, liveCells);
  return (
    liveNeighborCount === 3 ||
    (liveNeighborCount === 2 && contains(liveCells, cell))
  );
}

function candidates(liveCells: Cell[]): Cell[] {
  return withoutDuplicates([...liveCells, ...liveCells.flatMap(neighborsOf)]);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidates(liveCells).filter((cell) => livesOn(cell, liveCells));
}
