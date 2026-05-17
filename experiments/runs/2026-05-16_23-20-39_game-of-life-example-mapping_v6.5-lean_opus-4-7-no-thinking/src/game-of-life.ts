export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, alive: ReadonlySet<string>): number =>
  neighborsOf(cell).filter((n) => alive.has(cellKey(n))).length;

const willLive = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

const candidateCells = (cells: Cell[]): Cell[] =>
  [...new Map(
    cells.flatMap((c) => [c, ...neighborsOf(c)]).map((c) => [cellKey(c), c]),
  ).values()];

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive: ReadonlySet<string> = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((c) =>
    willLive(alive.has(cellKey(c)), countLiveNeighbors(c, alive)),
  );
}
