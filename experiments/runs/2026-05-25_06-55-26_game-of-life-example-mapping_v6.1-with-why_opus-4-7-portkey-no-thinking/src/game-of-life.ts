export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isBorn = (liveNeighbors: number): boolean =>
  liveNeighbors === 3;

const uniqueBy = <T>(items: T[], keyOf: (item: T) => string): T[] =>
  [...new Map(items.map((item) => [keyOf(item), item])).values()];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const alive = new Set(liveCells.map(key));
  const isAlive = (cell: Cell) => alive.has(key(cell));
  const liveNeighborCount = (cell: Cell) => neighborsOf(cell).filter(isAlive).length;

  const survivors = liveCells.filter((cell) => survives(liveNeighborCount(cell)));
  const candidates = uniqueBy(liveCells.flatMap(neighborsOf), key);
  const births = candidates.filter((cell) => !isAlive(cell) && isBorn(liveNeighborCount(cell)));

  return [...survivors, ...births];
}
