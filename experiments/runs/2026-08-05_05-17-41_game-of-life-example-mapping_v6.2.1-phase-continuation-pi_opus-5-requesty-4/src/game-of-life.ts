export type Cell = [number, number];

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const countLiveNeighbours = (cell: Cell, liveKeys: Set<string>): number =>
  neighboursOf(cell).filter((neighbour) => liveKeys.has(keyOf(neighbour))).length;

const isAliveNextGeneration = (isAlive: boolean, liveNeighbours: number): boolean =>
  liveNeighbours === 3 || (isAlive && liveNeighbours === 2);

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell): [string, Cell] => [keyOf(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));

  const cellsThatCouldChange = uniqueCells(
    liveCells.flatMap((cell) => [cell, ...neighboursOf(cell)]),
  );

  return cellsThatCouldChange.filter((cell) =>
    isAliveNextGeneration(liveKeys.has(keyOf(cell)), countLiveNeighbours(cell, liveKeys)),
  );
}
