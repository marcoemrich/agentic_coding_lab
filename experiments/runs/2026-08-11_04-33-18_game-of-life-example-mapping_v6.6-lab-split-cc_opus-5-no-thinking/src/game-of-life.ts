export type Cell = [number, number];

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const BIRTH_NEIGHBOUR_COUNT = 3;
const SURVIVAL_NEIGHBOUR_COUNTS = [
  MIN_NEIGHBOURS_TO_SURVIVE,
  BIRTH_NEIGHBOUR_COUNT,
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOUR_OFFSETS: Cell[] = [-1, 0, 1].flatMap((dx) =>
  [-1, 0, 1]
    .filter((dy) => dx !== 0 || dy !== 0)
    .map((dy): Cell => [dx, dy]),
);

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

type IsAlive = (cell: Cell) => boolean;

const aliveIn = (liveCells: Cell[]): IsAlive => {
  const liveKeys = new Set(liveCells.map(keyOf));
  return (cell) => liveKeys.has(keyOf(cell));
};

const countLiveNeighbours = (cell: Cell, isAlive: IsAlive): number =>
  neighboursOf(cell).filter(isAlive).length;

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [keyOf(cell), cell])).values(),
];

const birthCandidates = (liveCells: Cell[], isAlive: IsAlive): Cell[] =>
  uniqueCells(liveCells.flatMap(neighboursOf).filter((cell) => !isAlive(cell)));

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const isAlive = aliveIn(liveCells);

  const survives = (cell: Cell): boolean =>
    SURVIVAL_NEIGHBOUR_COUNTS.includes(countLiveNeighbours(cell, isAlive));

  const isBorn = (cell: Cell): boolean =>
    countLiveNeighbours(cell, isAlive) === BIRTH_NEIGHBOUR_COUNT;

  return [
    ...liveCells.filter(survives),
    ...birthCandidates(liveCells, isAlive).filter(isBorn),
  ];
}
