/** A live cell's position on an unbounded grid, as `[x, y]`. */
export type Cell = [x: number, y: number];

const isSameCell = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  ax === bx && ay === by;

const ADJACENT_OFFSETS = [-1, 0, 1];

/** The eight cells touching this one on a side or corner — itself excluded. */
const neighboursOf = (cell: Cell): Cell[] => {
  const [x, y] = cell;
  const surroundingBlock = ADJACENT_OFFSETS.flatMap((dx) =>
    ADJACENT_OFFSETS.map((dy): Cell => [x + dx, y + dy]),
  );
  return surroundingBlock.filter((other) => !isSameCell(other, cell));
};

const countLiveNeighbours = (cell: Cell, liveCells: Cell[]): number =>
  neighboursOf(cell).filter((neighbour) => isAlive(neighbour, liveCells))
    .length;

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const MAX_NEIGHBOURS_TO_SURVIVE = 3;
const NEIGHBOURS_TO_BE_BORN = 3;

/**
 * A live cell survives on a live-neighbour count within the survival range.
 *
 * This single range covers three rules: below the minimum is under-population
 * (rule 1), inside the range is survival (rule 2), above the maximum is
 * over-population (rule 3).
 */
const survives = (liveNeighbours: number): boolean =>
  liveNeighbours >= MIN_NEIGHBOURS_TO_SURVIVE &&
  liveNeighbours <= MAX_NEIGHBOURS_TO_SURVIVE;

const isAlive = (cell: Cell, liveCells: Cell[]): boolean =>
  liveCells.some((live) => isSameCell(live, cell));

/** A dead cell with exactly 3 live neighbours is born (rule 4, reproduction). */
const isBorn = (cell: Cell, liveCells: Cell[]): boolean =>
  !isAlive(cell, liveCells) &&
  countLiveNeighbours(cell, liveCells) === NEIGHBOURS_TO_BE_BORN;

const withoutDuplicates = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index) =>
      cells.findIndex((other) => isSameCell(other, cell)) === index,
  );

const survivorsOf = (liveCells: Cell[]): Cell[] =>
  liveCells.filter((cell) =>
    survives(countLiveNeighbours(cell, liveCells)),
  );

/** Only cells adjacent to a live cell can be born, so those are the candidates. */
const birthsAround = (liveCells: Cell[]): Cell[] =>
  withoutDuplicates(
    liveCells.flatMap(neighboursOf).filter((cell) => isBorn(cell, liveCells)),
  );

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return [...survivorsOf(liveCells), ...birthsAround(liveCells)];
}
