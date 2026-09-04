export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

// Conway's population thresholds: a live cell survives on 2 or 3 live
// neighbours; a dead cell is born on exactly 3.
const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
  liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const isBorn = (liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_TO_BE_BORN;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const isAlive = (cell: Cell): boolean => living.has(keyOf(cell));

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell)));

  const births = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of neighborsOf(cell)) {
      if (isAlive(candidate)) continue;
      if (isBorn(countLiveNeighbors(candidate))) births.set(keyOf(candidate), candidate);
    }
  }

  return [...survivors, ...births.values()];
}
