// game-of-life.ts
export type Cell = [number, number];

const isSameCell = ([x, y]: Cell, [ox, oy]: Cell): boolean =>
  x === ox && y === oy;

const offsets = [-1, 0, 1];

const neighborsOf = (cell: Cell): Cell[] =>
  offsets
    .flatMap((dx) => offsets.map((dy): Cell => [cell[0] + dx, cell[1] + dy]))
    .filter((candidate) => !isSameCell(candidate, cell));

const contains = (cells: Cell[], cell: Cell): boolean =>
  cells.some((other) => isSameCell(other, cell));

const unique = (cells: Cell[]): Cell[] =>
  cells.filter((cell, index) => !contains(cells.slice(0, index), cell));

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => contains(liveCells, neighbor)).length;

const survives = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 2 || liveNeighborCount === 3;

const isBorn = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 3;

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) =>
    survives(countLiveNeighbors(cell, liveCells)),
  );
  const born = unique(liveCells.flatMap(neighborsOf))
    .filter((cell) => !contains(liveCells, cell))
    .filter((cell) => isBorn(countLiveNeighbors(cell, liveCells)));
  return [...survivors, ...born];
};
