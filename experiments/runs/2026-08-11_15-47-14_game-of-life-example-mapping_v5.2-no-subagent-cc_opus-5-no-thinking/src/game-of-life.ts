/** A living cell on the infinite grid, as `[x, y]`. */
export type Cell = [number, number];

const isSameCell = ([x, y]: Cell, [otherX, otherY]: Cell): boolean =>
  x === otherX && y === otherY;

const ADJACENT_DISTANCE = 1;

const isNeighbourOf = (cell: Cell, other: Cell): boolean => {
  const [x, y] = cell;
  const [otherX, otherY] = other;
  return (
    !isSameCell(cell, other) &&
    Math.abs(otherX - x) <= ADJACENT_DISTANCE &&
    Math.abs(otherY - y) <= ADJACENT_DISTANCE
  );
};

const liveNeighbourCount = (cell: Cell, living: Cell[]): number =>
  living.filter((other) => isNeighbourOf(cell, other)).length;

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const MAX_NEIGHBOURS_TO_SURVIVE = 3;

const survives = (cell: Cell, living: Cell[]): boolean => {
  const neighbours = liveNeighbourCount(cell, living);
  return (
    neighbours >= MIN_NEIGHBOURS_TO_SURVIVE &&
    neighbours <= MAX_NEIGHBOURS_TO_SURVIVE
  );
};

const NEIGHBOURS_TO_BE_BORN = 3;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );

const isLiving = (cell: Cell, living: Cell[]): boolean =>
  living.some((other) => isSameCell(cell, other));

const isBorn = (cell: Cell, living: Cell[]): boolean =>
  !isLiving(cell, living) &&
  liveNeighbourCount(cell, living) === NEIGHBOURS_TO_BE_BORN;

const deduplicate = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(cell, other)) === index,
  );

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => survives(cell, cells));
  const births = deduplicate(cells.flatMap(neighboursOf)).filter((candidate) =>
    isBorn(candidate, cells),
  );

  return [...survivors, ...births];
}
