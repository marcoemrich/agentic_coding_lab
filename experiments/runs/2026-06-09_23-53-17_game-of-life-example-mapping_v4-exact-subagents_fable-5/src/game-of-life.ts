export type Cell = [number, number];

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isLive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => cellKey(liveCell) === cellKey(cell));

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isLive(neighbor, liveCells)).length;

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) =>
    survives(countLiveNeighbors(cell, liveCells)),
  );
  const births = uniqueCells(liveCells.flatMap(neighborsOf)).filter(
    (cell) =>
      !isLive(cell, liveCells) && isBorn(countLiveNeighbors(cell, liveCells)),
  );
  return [...survivors, ...births];
};
