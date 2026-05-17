export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const parseKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveKeys: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveKeys.has(cellKey(neighbor))).length;

const survives = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 2 || liveNeighborCount === 3;

const isBorn = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 3;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(cellKey));
  const survivors = cells.filter(
    (cell) => survives(countLiveNeighbors(cell, liveKeys))
  );
  const birthCandidateKeys = new Set(
    cells.flatMap(neighborsOf).map(cellKey)
  );
  const births: Cell[] = [...birthCandidateKeys]
    .filter((key) => !liveKeys.has(key))
    .map(parseKey)
    .filter((cell) => isBorn(countLiveNeighbors(cell, liveKeys)));
  return [...survivors, ...births];
};
