export type Cell = [number, number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const areNeighbors = (cell: Cell, other: Cell): boolean => {
  const [x, y] = cell;
  const [otherX, otherY] = other;
  return (
    Math.abs(otherX - x) <= 1 &&
    Math.abs(otherY - y) <= 1 &&
    !isSameCell(cell, other)
  );
};

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((liveCell) => areNeighbors(cell, liveCell)).length;

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const isBorn = (neighborCount: number): boolean => neighborCount === 3;

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((liveCell) => isSameCell(cell, liveCell));

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

const withoutDuplicateCells = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      index === cells.findIndex((other) => isSameCell(cell, other)),
  );

const birthCandidates = (liveCells: Cell[]): Cell[] =>
  withoutDuplicateCells(
    liveCells.flatMap(neighborsOf).filter((cell) => !isAlive(cell, liveCells)),
  );

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) =>
    survives(countLiveNeighbors(cell, liveCells)),
  );
  const born = birthCandidates(liveCells).filter((cell) =>
    isBorn(countLiveNeighbors(cell, liveCells)),
  );
  return [...survivors, ...born];
}
