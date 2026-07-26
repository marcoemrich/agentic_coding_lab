export type Cell = [x: number, y: number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const isLive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => isSameCell(cell, liveCell));

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isLive(neighbor, liveCells)).length;

const withoutDuplicates = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      index === cells.findIndex((other) => isSameCell(cell, other)),
  );

const isLiveNextGeneration = (cell: Cell, liveCells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveCells);
  const survives = liveNeighbors === 2 || liveNeighbors === 3;
  const isBorn = liveNeighbors === 3;
  return isLive(cell, liveCells) ? survives : isBorn;
};

const cellsThatCouldChange = (liveCells: Cell[]): Cell[] =>
  withoutDuplicates(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

export const nextGeneration = (liveCells: Cell[]): Cell[] =>
  cellsThatCouldChange(liveCells).filter((cell) =>
    isLiveNextGeneration(cell, liveCells),
  );
