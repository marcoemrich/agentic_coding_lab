export type Cell = [number, number];

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const MAX_NEIGHBOURS_TO_SURVIVE = 3;
const NEIGHBOURS_TO_BE_BORN = 3;

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const distinct = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [keyOf(cell), cell])).values()];

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(keyOf));

  const isAlive = (cell: Cell): boolean => livingKeys.has(keyOf(cell));

  const countLiveNeighbours = (cell: Cell): number =>
    neighboursOf(cell).filter(isAlive).length;

  const survives = (cell: Cell): boolean => {
    const liveNeighbours = countLiveNeighbours(cell);
    return (
      liveNeighbours >= MIN_NEIGHBOURS_TO_SURVIVE &&
      liveNeighbours <= MAX_NEIGHBOURS_TO_SURVIVE
    );
  };

  const isBorn = (cell: Cell): boolean =>
    !isAlive(cell) && countLiveNeighbours(cell) === NEIGHBOURS_TO_BE_BORN;

  const candidatesForBirth = distinct(cells.flatMap(neighboursOf));

  return [...cells.filter(survives), ...candidatesForBirth.filter(isBorn)];
}
