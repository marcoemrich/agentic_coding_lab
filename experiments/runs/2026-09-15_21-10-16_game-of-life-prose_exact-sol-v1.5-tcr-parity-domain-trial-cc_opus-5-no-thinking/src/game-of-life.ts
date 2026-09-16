export type Cell = [number, number]; // [x, y]

const MIN_SURVIVING_NEIGHBOURS = 2;
const MAX_SURVIVING_NEIGHBOURS = 3;
const SURVIVING_NEIGHBOUR_COUNTS = [
  MIN_SURVIVING_NEIGHBOURS,
  MAX_SURVIVING_NEIGHBOURS,
];
const REPRODUCING_NEIGHBOUR_COUNT = 3;

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const isNeighbour = (cell: Cell, other: Cell): boolean =>
  !isSameCell(cell, other) &&
  Math.abs(cell[0] - other[0]) <= 1 &&
  Math.abs(cell[1] - other[1]) <= 1;

const neighboursOf = ([x, y]: Cell): Cell[] => {
  const neighbours: Cell[] = [];
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx !== 0 || dy !== 0) {
        neighbours.push([x + dx, y + dy]);
      }
    }
  }
  return neighbours;
};

const countLiveNeighbours = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => isNeighbour(cell, other)).length;

const isAlive = (cell: Cell, cells: Cell[]): boolean =>
  cells.some((other) => isSameCell(cell, other));

const distinct = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(cell, other)) === index,
  );

const survives = (cell: Cell, cells: Cell[]): boolean =>
  SURVIVING_NEIGHBOUR_COUNTS.includes(countLiveNeighbours(cell, cells));

const isBorn = (cell: Cell, cells: Cell[]): boolean =>
  !isAlive(cell, cells) &&
  countLiveNeighbours(cell, cells) === REPRODUCING_NEIGHBOUR_COUNT;

const birthCandidates = (cells: Cell[]): Cell[] =>
  distinct(cells.flatMap((cell) => neighboursOf(cell)));

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(cell, cells));
  const births = birthCandidates(cells).filter((cell) => isBorn(cell, cells));

  return [...survivors, ...births];
}
