export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(cellKey(cell));
  const neighborsOf = ([x, y]: Cell): Cell[] =>
    NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const candidates = new Map<string, Cell>(
    cells.flatMap((cell) => [cell, ...neighborsOf(cell)]).map((c) => [cellKey(c), c])
  );

  const survives = (cell: Cell, liveNeighbors: number): boolean =>
    isAlive(cell) ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

  return [...candidates.values()].filter((cell) => survives(cell, liveNeighborCount(cell)));
}
