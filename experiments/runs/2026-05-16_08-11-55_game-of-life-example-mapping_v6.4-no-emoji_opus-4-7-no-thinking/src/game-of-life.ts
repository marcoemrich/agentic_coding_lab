export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isAlive = (cell: Cell, cells: Cell[]): boolean =>
  cells.some((other) => cellKey(other) === cellKey(cell));

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isAlive(neighbor, cells)).length;

const uniqueCells = (cells: Cell[]): Cell[] =>
  Array.from(new Map(cells.map((cell) => [cellKey(cell), cell])).values());

const candidateCells = (cells: Cell[]): Cell[] =>
  uniqueCells(cells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

const survivesOrBorn = (cell: Cell, cells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, cells);
  return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell, cells));
};

export const nextGeneration = (cells: Cell[]): Cell[] =>
  candidateCells(cells).filter((cell) => survivesOrBorn(cell, cells));
