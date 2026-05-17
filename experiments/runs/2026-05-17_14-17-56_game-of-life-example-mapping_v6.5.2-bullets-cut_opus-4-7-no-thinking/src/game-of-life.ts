export type LiveCell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: LiveCell): string => `${x},${y}`;

const countLiveNeighbors = ([x, y]: LiveCell, liveSet: Set<string>): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) =>
    liveSet.has(cellKey([x + dx, y + dy])),
  ).length;

const isAliveNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);

const cellAndNeighbors = ([x, y]: LiveCell): LiveCell[] => [
  [x, y],
  ...NEIGHBOR_OFFSETS.map(([dx, dy]): LiveCell => [x + dx, y + dy]),
];

const candidateCells = (liveCells: LiveCell[]): LiveCell[] => {
  const candidates = new Map<string, LiveCell>(
    liveCells.flatMap(cellAndNeighbors).map((cell) => [cellKey(cell), cell]),
  );
  return [...candidates.values()];
};

export function nextGeneration(liveCells: LiveCell[]): LiveCell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  return candidateCells(liveCells).filter((cell) =>
    isAliveNextGeneration(liveSet.has(cellKey(cell)), countLiveNeighbors(cell, liveSet)),
  );
}
