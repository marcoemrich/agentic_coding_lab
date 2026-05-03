type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const getNeighbors = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveKeys: Set<string>): number =>
  getNeighbors(cell).filter((neighbor) => liveKeys.has(cellKey(neighbor))).length;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isReborn = (liveNeighbors: number): boolean =>
  liveNeighbors === 3;

const uniqueCells = (cells: Cell[]): Cell[] =>
  Array.from(new Map(cells.map((cell) => [cellKey(cell), cell])).values());

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(cellKey));
  const survivors = cells.filter((cell) => survives(countLiveNeighbors(cell, liveKeys)));
  const reborn = uniqueCells(cells.flatMap(getNeighbors))
    .filter((cell) => !liveKeys.has(cellKey(cell)))
    .filter((cell) => isReborn(countLiveNeighbors(cell, liveKeys)));
  return [...survivors, ...reborn];
};
