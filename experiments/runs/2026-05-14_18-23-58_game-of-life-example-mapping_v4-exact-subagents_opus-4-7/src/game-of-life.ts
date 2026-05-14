export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] =>
  Array.from(new Map(cells.map((c) => [cellKey(c), c])).values());

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const isLive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isLive).length;

  const willBeAlive = (cell: Cell): boolean => {
    const liveNeighborCount = countLiveNeighbors(cell);
    return liveNeighborCount === 3 || (liveNeighborCount === 2 && isLive(cell));
  };

  const candidates = uniqueCells(
    cells.flatMap((cell) => [cell, ...neighborsOf(cell)]),
  );
  return candidates.filter(willBeAlive);
}
