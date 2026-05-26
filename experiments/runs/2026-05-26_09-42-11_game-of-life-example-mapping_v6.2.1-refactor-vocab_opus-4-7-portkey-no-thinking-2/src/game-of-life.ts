export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const livesNextGeneration = (isAlive: boolean, aliveNeighborCount: number): boolean =>
  aliveNeighborCount === 3 || (isAlive && aliveNeighborCount === 2);

const candidateCells = (liveCells: Cell[]): Cell[] => {
  const liveAndNeighbors = liveCells.flatMap((cell) => [cell, ...neighborsOf(cell)]);
  return [...new Map(liveAndNeighbors.map((cell) => [cellKey(cell), cell])).values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(cellKey(cell));
  const countAliveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  return candidateCells(cells)
    .filter((cell) => livesNextGeneration(isAlive(cell), countAliveNeighbors(cell)));
}
