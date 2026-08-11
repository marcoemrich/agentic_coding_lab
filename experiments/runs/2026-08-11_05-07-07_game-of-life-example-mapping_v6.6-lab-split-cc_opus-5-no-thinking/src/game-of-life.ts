export type Cell = [x: number, y: number];

const key = ([x, y]: Cell): string => `${x},${y}`;

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

// A live cell survives on 2 or 3 live neighbours; fewer is underpopulation,
// more is overpopulation. A dead cell is born on exactly 3.
const SPARSE_SURVIVAL_COUNT = 2;
const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNTS = [SPARSE_SURVIVAL_COUNT, BIRTH_NEIGHBOR_COUNT];

const neighbors = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const cellsThatCouldChange = (cells: Cell[]): Cell[] => {
  const unique = new Map(
    cells
      .flatMap((cell) => [cell, ...neighbors(cell)])
      .map((cell) => [key(cell), cell] as const),
  );
  return [...unique.values()];
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const living = new Set(cells.map(key));
  const liveNeighborCount = (cell: Cell): number =>
    neighbors(cell).filter((n) => living.has(key(n))).length;

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = liveNeighborCount(cell);
    const isCurrentlyAlive = living.has(key(cell));
    return isCurrentlyAlive
      ? SURVIVAL_NEIGHBOR_COUNTS.includes(liveNeighbors)
      : liveNeighbors === BIRTH_NEIGHBOR_COUNT;
  };

  return cellsThatCouldChange(cells).filter(isAliveNextGeneration);
};
