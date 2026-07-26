export type Cell = [number, number];

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

const identityOf = ([x, y]: Cell): string => `${x},${y}`;

type IsLive = (cell: Cell) => boolean;

const isLiveIn = (liveCells: Cell[]): IsLive => {
  const liveIdentities = new Set(liveCells.map(identityOf));
  return (cell) => liveIdentities.has(identityOf(cell));
};

const countLiveNeighbors = (cell: Cell, isLive: IsLive): number =>
  neighborsOf(cell).filter(isLive).length;

const withoutDuplicates = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [identityOf(cell), cell])).values(),
];

const candidatesForNextGeneration = (liveCells: Cell[]): Cell[] =>
  withoutDuplicates([...liveCells, ...liveCells.flatMap(neighborsOf)]);

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const BIRTH_NEIGHBOR_COUNT = 3;

const isLiveNextGeneration = (cell: Cell, isLive: IsLive): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, isLive);
  return isLive(cell)
    ? liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
        liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
    : liveNeighbors === BIRTH_NEIGHBOR_COUNT;
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const isLive = isLiveIn(liveCells);
  return candidatesForNextGeneration(liveCells).filter((cell) =>
    isLiveNextGeneration(cell, isLive),
  );
};
