export type Cell = [x: number, y: number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

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

const isLiving = (cell: Cell, livingCells: Cell[]): boolean =>
  livingCells.some((livingCell) => isSameCell(cell, livingCell));

const countLivingNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isLiving(neighbor, livingCells)).length;

const survives = (livingNeighbors: number): boolean =>
  livingNeighbors >= 2 && livingNeighbors <= 3;

const isBorn = (livingNeighbors: number): boolean => livingNeighbors === 3;

const withoutDuplicates = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(cell, other)) === index,
  );

const candidateCells = (livingCells: Cell[]): Cell[] =>
  withoutDuplicates([...livingCells, ...livingCells.flatMap(neighborsOf)]);

const willBeAlive = (cell: Cell, livingCells: Cell[]): boolean => {
  const livingNeighbors = countLivingNeighbors(cell, livingCells);
  return isLiving(cell, livingCells)
    ? survives(livingNeighbors)
    : isBorn(livingNeighbors);
};

export const nextGeneration = (livingCells: Cell[]): Cell[] =>
  candidateCells(livingCells).filter((cell) => willBeAlive(cell, livingCells));
