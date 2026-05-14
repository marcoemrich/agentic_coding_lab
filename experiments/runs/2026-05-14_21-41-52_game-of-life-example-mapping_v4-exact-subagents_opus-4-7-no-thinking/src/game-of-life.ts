export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const getNeighbors = (cell: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [cell[0] + dx, cell[1] + dy]);

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number =>
  getNeighbors(cell).filter((neighbor) => liveSet.has(cellKey(neighbor))).length;

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveSet = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Cell>(
    liveCells
      .flatMap((cell) => [cell, ...getNeighbors(cell)])
      .map((cell) => [cellKey(cell), cell])
  );

  return [...candidates.values()].filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell, liveSet);
    return liveSet.has(cellKey(cell))
      ? liveNeighbors === 2 || liveNeighbors === 3
      : liveNeighbors === 3;
  });
};
