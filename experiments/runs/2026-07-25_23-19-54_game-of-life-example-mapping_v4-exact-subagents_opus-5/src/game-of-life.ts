export type Cell = [number, number];

const isSameCell = ([x1, y1]: Cell, [x2, y2]: Cell): boolean =>
  x1 === x2 && y1 === y2;

const isAlive = (cell: Cell, livingCells: Cell[]): boolean =>
  livingCells.some((livingCell) => isSameCell(cell, livingCell));

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x - 1, y],
  [x - 1, y + 1],
  [x, y - 1],
  [x, y + 1],
  [x + 1, y - 1],
  [x + 1, y],
  [x + 1, y + 1],
];

const countLiveNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  neighborsOf(cell).filter((neighbor) => isAlive(neighbor, livingCells)).length;

const withoutDuplicates = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(cell, other)) === index,
  );

const cellsToEvaluate = (livingCells: Cell[]): Cell[] =>
  withoutDuplicates([...livingCells, ...livingCells.flatMap(neighborsOf)]);

const isAliveNextGeneration = (cell: Cell, livingCells: Cell[]): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, livingCells);
  return (
    liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell, livingCells))
  );
};

export const nextGeneration = (livingCells: Cell[]): Cell[] =>
  cellsToEvaluate(livingCells).filter((cell) =>
    isAliveNextGeneration(cell, livingCells),
  );
