export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveSet: ReadonlySet<string>): number =>
  neighborsOf(cell).filter((n) => liveSet.has(cellKey(n))).length;

const survivesConwayRule = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

const isAliveNextGeneration = (cell: Cell, liveSet: ReadonlySet<string>): boolean =>
  survivesConwayRule(liveSet.has(cellKey(cell)), countLiveNeighbors(cell, liveSet));

const candidateCellsFor = (liveCells: readonly Cell[]): Cell[] => {
  const allCandidates = liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  return [...new Map(allCandidates.map((c) => [cellKey(c), c])).values()];
};

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  return candidateCellsFor(liveCells).filter((cell) => isAliveNextGeneration(cell, liveSet));
}
