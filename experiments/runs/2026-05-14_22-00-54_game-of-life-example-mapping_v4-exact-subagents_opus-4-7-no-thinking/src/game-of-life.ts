type Cell = [number, number];

const cellsEqual = ([x1, y1]: Cell, [x2, y2]: Cell): boolean =>
  x1 === x2 && y1 === y2;

const areNeighbors = (a: Cell, b: Cell): boolean =>
  !cellsEqual(a, b) && Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1;

const countLiveNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => areNeighbors(cell, other)).length;

const isLive = (cell: Cell, cells: Cell[]): boolean =>
  cells.some((other) => cellsEqual(cell, other));

const NEIGHBORHOOD_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],  [0, 0],  [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const getCandidates = (cells: Cell[]): Cell[] => {
  const candidates = cells.flatMap(([x, y]) =>
    NEIGHBORHOOD_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy])
  );
  const unique = new Map(candidates.map((cell) => [cellKey(cell), cell]));
  return [...unique.values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  return getCandidates(cells).filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, cells);
    return liveNeighbors === 3 || (liveNeighbors === 2 && isLive(cell, cells));
  });
}
