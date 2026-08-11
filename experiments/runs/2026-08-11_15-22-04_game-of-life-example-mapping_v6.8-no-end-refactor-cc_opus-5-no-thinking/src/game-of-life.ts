export type Cell = [x: number, y: number];

// A cell's identity is its position, but arrays compare by reference, so the
// same position reached twice is two distinct values. This key restores
// identity: equal positions produce equal keys.
const keyOf = ([x, y]: Cell): string => `${x},${y}`;

// Membership test for the current generation, closed over its own index.
type LiveSet = (cell: Cell) => boolean;

const OFFSETS = [-1, 0, 1];

const isSelf = ([dx, dy]: Cell): boolean => dx === 0 && dy === 0;

const NEIGHBOR_OFFSETS: Cell[] = OFFSETS.flatMap((dx) =>
  OFFSETS.map((dy): Cell => [dx, dy]),
).filter((offset) => !isSelf(offset));

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, isLive: LiveSet): number =>
  neighborsOf(cell).filter(isLive).length;

// Fewer than 2 neighbors is underpopulation, more than 3 is overpopulation;
// both are death. Only this band survives.
const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;

const survives = (liveNeighborCount: number): boolean =>
  liveNeighborCount >= MIN_NEIGHBORS_TO_SURVIVE &&
  liveNeighborCount <= MAX_NEIGHBORS_TO_SURVIVE;

const NEIGHBORS_TO_BE_BORN = 3;

const isBorn = (liveNeighborCount: number): boolean =>
  liveNeighborCount === NEIGHBORS_TO_BE_BORN;

const liveSet = (liveCells: Cell[]): LiveSet => {
  const keys = new Set(liveCells.map(keyOf));
  return (cell) => keys.has(keyOf(cell));
};

const deduplicate = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [keyOf(cell), cell])).values(),
];

// Only cells touching a live cell can change state, so the rest of the
// infinite grid never needs to be examined.
const cellsToEvaluate = (liveCells: Cell[]): Cell[] =>
  deduplicate(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const isLive = liveSet(liveCells);
  return cellsToEvaluate(liveCells).filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(cell, isLive);
    return isLive(cell)
      ? survives(liveNeighborCount)
      : isBorn(liveNeighborCount);
  });
}
