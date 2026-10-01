type Cell = [number, number];

const OFFSETS = [-1, 0, 1];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  OFFSETS.flatMap((dx) => OFFSETS.map((dy): Cell => [x + dx, y + dy])).filter(
    ([nx, ny]) => nx !== x || ny !== y,
  );

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [toKey(cell), cell])).values(),
];

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(toKey(cell));
  const countLiveNeighbors = (cell: Cell): number => neighborsOf(cell).filter(isAlive).length;

  const survivors = liveCells.filter((cell) => survives(countLiveNeighbors(cell)));
  const births = uniqueCells(liveCells.flatMap(neighborsOf)).filter(
    (cell) => !isAlive(cell) && isBorn(countLiveNeighbors(cell)),
  );
  return [...survivors, ...births];
}
