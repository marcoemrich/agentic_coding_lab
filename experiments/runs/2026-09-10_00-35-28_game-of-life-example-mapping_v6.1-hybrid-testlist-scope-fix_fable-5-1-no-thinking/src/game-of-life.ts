export type Cell = [number, number]; // [x, y]

const OFFSETS = [-1, 0, 1];
const NEIGHBOR_OFFSETS: Cell[] = OFFSETS.flatMap((dx) =>
  OFFSETS.map((dy): Cell => [dx, dy]),
).filter(([dx, dy]) => dx !== 0 || dy !== 0);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const unique = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [toKey(cell), cell])).values(),
];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_FOR_BIRTH = 3;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
  liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const isBorn = (liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_FOR_BIRTH;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(toKey(cell));
  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell)));
  const deadNeighbors = unique(
    cells.flatMap(neighborsOf).filter((cell) => !isAlive(cell)),
  );
  const births = deadNeighbors.filter((cell) =>
    isBorn(countLiveNeighbors(cell)),
  );

  return [...survivors, ...births];
}
