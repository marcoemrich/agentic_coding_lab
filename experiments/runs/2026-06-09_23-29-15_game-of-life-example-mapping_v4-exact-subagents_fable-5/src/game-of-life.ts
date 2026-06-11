export type Cell = [number, number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const containsCell = (cells: Cell[], cell: Cell): boolean =>
  cells.some((other) => isSameCell(other, cell));

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const deduplicate = (cells: Cell[]): Cell[] =>
  cells.filter((cell, index) => !containsCell(cells.slice(0, index), cell));

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => containsCell(liveCells, neighbor))
    .length;

const survives = (cell: Cell, liveCells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  return liveNeighbors === 2 || liveNeighbors === 3;
};

const isBorn = (cell: Cell, liveCells: Cell[]): boolean =>
  !containsCell(liveCells, cell) && countLiveNeighbors(cell, liveCells) === 3;

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) => survives(cell, liveCells));
  const birthCandidates = deduplicate(liveCells.flatMap(neighborsOf));
  const births = birthCandidates.filter((cell) => isBorn(cell, liveCells));
  return [...survivors, ...births];
};
