export type Cell = [number, number];

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const NEIGHBOURS_TO_BE_BORN = 3;

const isAliveNextGeneration = (
  isCurrentlyLive: boolean,
  liveNeighbours: number,
): boolean =>
  isCurrentlyLive
    ? liveNeighbours === MIN_NEIGHBOURS_TO_SURVIVE ||
      liveNeighbours === NEIGHBOURS_TO_BE_BORN
    : liveNeighbours === NEIGHBOURS_TO_BE_BORN;

const dedupeByKey = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [key(cell), cell] as const)).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(key));
  const isLive = (cell: Cell): boolean => liveCellKeys.has(key(cell));
  const liveNeighbourCount = (cell: Cell): number =>
    neighboursOf(cell).filter(isLive).length;

  // A cell can only change state if it is live or adjacent to a live one,
  // which keeps the grid effectively infinite without scanning it.
  const cellsThatCouldChange = dedupeByKey(
    liveCells.flatMap((liveCell) => [liveCell, ...neighboursOf(liveCell)]),
  );

  return cellsThatCouldChange.filter((cell) =>
    isAliveNextGeneration(isLive(cell), liveNeighbourCount(cell)),
  );
}
