/** Coordinates of a live cell as [x, y]. */
export type Cell = [number, number];

const key = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number =>
  neighborsOf(cell).filter((n) => liveSet.has(key(n))).length;

const BIRTH_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

const isAliveNextGeneration = (liveNeighbors: number, isCurrentlyAlive: boolean): boolean =>
  liveNeighbors === BIRTH_NEIGHBOR_COUNT || (liveNeighbors === SURVIVAL_NEIGHBOR_COUNT && isCurrentlyAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(key));
  const candidates = new Map<string, Cell>(
    liveCells.flatMap((live) => [live, ...neighborsOf(live)]).map((cell) => [key(cell), cell]),
  );
  return [...candidates.values()].filter((cell) =>
    isAliveNextGeneration(countLiveNeighbors(cell, liveSet), liveSet.has(key(cell))),
  );
}
