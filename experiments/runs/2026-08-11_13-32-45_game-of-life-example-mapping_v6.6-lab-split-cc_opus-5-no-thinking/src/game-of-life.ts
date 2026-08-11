export type Cell = [x: number, y: number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const isNeighbourOf = (cell: Cell, candidate: Cell): boolean =>
  !isSameCell(cell, candidate) &&
  Math.abs(candidate[0] - cell[0]) <= 1 &&
  Math.abs(candidate[1] - cell[1]) <= 1;

const countLiveNeighbours = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((candidate) => isNeighbourOf(cell, candidate)).length;

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => isSameCell(cell, liveCell));

const UNDERPOPULATION_THRESHOLD = 2;
const REPRODUCTION_COUNT = 3;

const NEIGHBOURS_TO_SURVIVE = [UNDERPOPULATION_THRESHOLD, REPRODUCTION_COUNT];
const NEIGHBOURS_TO_BE_BORN = [REPRODUCTION_COUNT];

const isAliveNextGeneration = (cell: Cell, liveCells: Cell[]): boolean => {
  const neighbours = countLiveNeighbours(cell, liveCells);
  const neighbourCountsForLife = isAlive(cell, liveCells)
    ? NEIGHBOURS_TO_SURVIVE
    : NEIGHBOURS_TO_BE_BORN;

  return neighbourCountsForLife.includes(neighbours);
};

const NEIGHBOUR_OFFSETS = [-1, 0, 1];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const cellAndItsNeighbours = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.flatMap((offsetX) =>
    NEIGHBOUR_OFFSETS.map((offsetY): Cell => [x + offsetX, y + offsetY]),
  );

const deduplicated = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

const cellsToEvaluate = (liveCells: Cell[]): Cell[] =>
  deduplicated(liveCells.flatMap(cellAndItsNeighbours));

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return cellsToEvaluate(liveCells).filter((cell) =>
    isAliveNextGeneration(cell, liveCells),
  );
}
