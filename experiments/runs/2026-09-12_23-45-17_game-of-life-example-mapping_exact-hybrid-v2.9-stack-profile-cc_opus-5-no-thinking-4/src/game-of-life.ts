export type Cell = [x: number, y: number];

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const MAX_NEIGHBOURS_TO_SURVIVE = 3;
const NEIGHBOURS_TO_REPRODUCE = 3;

const isAliveNextGeneration = (
  isAliveNow: boolean,
  liveNeighbours: number
): boolean => {
  if (liveNeighbours < MIN_NEIGHBOURS_TO_SURVIVE) return false; // underpopulation
  if (liveNeighbours > MAX_NEIGHBOURS_TO_SURVIVE) return false; // overpopulation
  // Within the survival range from here on.
  if (isAliveNow) return true; // survival
  return liveNeighbours === NEIGHBOURS_TO_REPRODUCE; // reproduction
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(keyOf));
  const isAlive = (cell: Cell): boolean => liveKeys.has(keyOf(cell));
  const countLiveNeighbours = (cell: Cell): number =>
    neighboursOf(cell).filter(isAlive).length;

  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    // A lone cell is nobody's neighbour, so it must seed itself.
    candidates.set(keyOf(cell), cell);
    for (const neighbour of neighboursOf(cell)) {
      candidates.set(keyOf(neighbour), neighbour);
    }
  }

  return [...candidates.values()].filter((cell) =>
    isAliveNextGeneration(isAlive(cell), countLiveNeighbours(cell))
  );
};
