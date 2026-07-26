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
  livingCells.some((living) => isSameCell(cell, living));

const countLivingNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isLiving(neighbor, livingCells)).length;

const dedupeCells = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index, all) =>
      all.findIndex((other) => isSameCell(cell, other)) === index,
  );

const cellsThatCouldChange = (livingCells: Cell[]): Cell[] =>
  dedupeCells(livingCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

const isAliveInNextGeneration = (cell: Cell, livingCells: Cell[]): boolean => {
  const livingNeighborCount = countLivingNeighbors(cell, livingCells);
  const survives = livingNeighborCount === 2 || livingNeighborCount === 3;
  const isBorn = livingNeighborCount === 3;
  return isLiving(cell, livingCells) ? survives : isBorn;
};

export const nextGeneration = (livingCells: Cell[]): Cell[] =>
  cellsThatCouldChange(livingCells).filter((cell) =>
    isAliveInNextGeneration(cell, livingCells),
  );
