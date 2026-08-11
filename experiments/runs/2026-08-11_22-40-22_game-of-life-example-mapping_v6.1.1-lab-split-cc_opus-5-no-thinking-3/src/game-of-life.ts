export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const survives = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 2 || liveNeighborCount === 3;

const isBorn = (liveNeighborCount: number): boolean => liveNeighborCount === 3;

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

const candidateCells = (liveCells: Cell[]): Cell[] =>
  uniqueCells(liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  return candidateCells(liveCells).filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(cell);
    return isAlive(cell) ? survives(liveNeighborCount) : isBorn(liveNeighborCount);
  });
}
