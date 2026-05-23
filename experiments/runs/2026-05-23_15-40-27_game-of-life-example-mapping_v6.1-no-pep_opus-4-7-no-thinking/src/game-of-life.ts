export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survivesOrIsBorn = (liveNeighbors: number, wasAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && wasAlive);

const uniqueCells = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const wasAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(wasAlive).length;

  const candidates = uniqueCells(cells.flatMap((cell) => [cell, ...neighborsOf(cell)]));

  return candidates.filter((cell) => survivesOrIsBorn(liveNeighborCount(cell), wasAlive(cell)));
}
