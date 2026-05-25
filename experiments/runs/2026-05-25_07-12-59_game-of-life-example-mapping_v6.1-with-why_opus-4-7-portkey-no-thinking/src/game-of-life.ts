export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survivesOrIsBorn = (liveNeighbors: number, isCurrentlyAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isCurrentlyAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveCells.has(cellKey(cell));
  const countLiveNeighbors = (cell: Cell): number => neighborsOf(cell).filter(isAlive).length;

  const candidates = cells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  const uniqueCandidates = new Map(candidates.map((cell) => [cellKey(cell), cell]));

  return [...uniqueCandidates.values()].filter((cell) =>
    survivesOrIsBorn(countLiveNeighbors(cell), isAlive(cell)),
  );
}
