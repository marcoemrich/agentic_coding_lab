export type Cell = [number, number];

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const FEWEST_NEIGHBOURS_THAT_SUSTAIN_LIFE = 2;
const MOST_NEIGHBOURS_THAT_SUSTAIN_LIFE = 3;
const NEIGHBOURS_NEEDED_TO_BE_BORN = 3;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const distinct = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [keyOf(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const isLive = (cell: Cell): boolean => liveKeys.has(keyOf(cell));

  const neighboursOf = ([x, y]: Cell): Cell[] =>
    NEIGHBOUR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

  const countLiveNeighbours = (cell: Cell): number =>
    neighboursOf(cell).filter(isLive).length;

  const liveCellSurvives = (cell: Cell): boolean => {
    const neighbours = countLiveNeighbours(cell);
    return (
      neighbours >= FEWEST_NEIGHBOURS_THAT_SUSTAIN_LIFE &&
      neighbours <= MOST_NEIGHBOURS_THAT_SUSTAIN_LIFE
    );
  };

  const isBorn = (cell: Cell): boolean =>
    !isLive(cell) && countLiveNeighbours(cell) === NEIGHBOURS_NEEDED_TO_BE_BORN;

  const survivors = liveCells.filter(liveCellSurvives);
  const births = distinct(liveCells.flatMap(neighboursOf)).filter(isBorn);

  return [...survivors, ...births];
}
