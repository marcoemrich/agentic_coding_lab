type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellsEqual = ([x1, y1]: Cell, [x2, y2]: Cell): boolean =>
  x1 === x2 && y1 === y2;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) =>
    liveCells.some((live) => cellsEqual(live, neighbor))
  ).length;

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const isDead = (cell: Cell, liveCells: Cell[]): boolean =>
  !liveCells.some((live) => cellsEqual(live, cell));

const isUnique = (cell: Cell, index: number, cells: Cell[]): boolean =>
  cells.findIndex((other) => cellsEqual(other, cell)) === index;

const deadNeighborCandidates = (liveCells: Cell[]): Cell[] =>
  liveCells
    .flatMap(neighborsOf)
    .filter((cell) => isDead(cell, liveCells))
    .filter(isUnique);

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) =>
    survives(countLiveNeighbors(cell, liveCells))
  );
  const births = deadNeighborCandidates(liveCells).filter(
    (cell) => countLiveNeighbors(cell, liveCells) === 3
  );
  return [...survivors, ...births];
};
