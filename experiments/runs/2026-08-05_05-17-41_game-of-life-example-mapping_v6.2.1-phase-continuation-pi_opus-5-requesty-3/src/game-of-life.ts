export type Cell = [x: number, y: number];

const NEIGHBOUR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighboursOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOUR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));

  const countLiveNeighbours = (cell: Cell): number =>
    neighboursOf(cell).filter(isAlive).length;

  const willLive = (cell: Cell): boolean => {
    const liveNeighbours = countLiveNeighbours(cell);
    return liveNeighbours === 3 || (liveNeighbours === 2 && isAlive(cell));
  };

  // Every cell that can be alive next generation is a neighbour of a live cell:
  // a live cell with no live neighbours dies of underpopulation anyway.
  return uniqueCells(liveCells.flatMap(neighboursOf)).filter(willLive);
}
