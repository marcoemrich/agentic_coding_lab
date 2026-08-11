export type Cell = [number, number];

function isSameCell([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return x === otherX && y === otherY;
}

function contains(cells: Cell[], cell: Cell): boolean {
  return cells.some((candidate) => isSameCell(candidate, cell));
}

const NEIGHBOR_OFFSETS = [-1, 0, 1];

function neighborsOf(cell: Cell): Cell[] {
  const [x, y] = cell;
  return NEIGHBOR_OFFSETS.flatMap((dx) =>
    NEIGHBOR_OFFSETS.map((dy): Cell => [x + dx, y + dy]),
  ).filter((neighbor) => !isSameCell(neighbor, cell));
}

function countLiveNeighbors(cell: Cell, liveCells: Cell[]): number {
  return neighborsOf(cell).filter((neighbor) => contains(liveCells, neighbor))
    .length;
}

function survives(cell: Cell, liveCells: Cell[]): boolean {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  return liveNeighbors === 2 || liveNeighbors === 3;
}

function isBorn(cell: Cell, liveCells: Cell[]): boolean {
  return countLiveNeighbors(cell, liveCells) === 3;
}

function deduplicate(cells: Cell[]): Cell[] {
  return cells.filter((cell, index) => !contains(cells.slice(0, index), cell));
}

function deadNeighborsOf(liveCells: Cell[]): Cell[] {
  const allNeighbors = liveCells.flatMap(neighborsOf);
  return deduplicate(allNeighbors).filter(
    (neighbor) => !contains(liveCells, neighbor),
  );
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => survives(cell, liveCells));
  const births = deadNeighborsOf(liveCells).filter((cell) =>
    isBorn(cell, liveCells),
  );
  return [...survivors, ...births];
}
