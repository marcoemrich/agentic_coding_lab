export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; liveNeighborCount: number };

const tallyLiveNeighbors = (liveCells: Cell[]): NeighborTally[] => {
  const tallies = new Map<string, NeighborTally>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = cellKey(neighbor);
      const priorCount = tallies.get(key)?.liveNeighborCount ?? 0;
      tallies.set(key, { cell: neighbor, liveNeighborCount: priorCount + 1 });
    }
  }
  return [...tallies.values()];
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const survivesOrIsBorn = ({ cell, liveNeighborCount }: NeighborTally): boolean =>
    liveNeighborCount === 3 || (liveNeighborCount === 2 && liveKeys.has(cellKey(cell)));

  return tallyLiveNeighbors(liveCells)
    .filter(survivesOrIsBorn)
    .map(({ cell }) => cell);
};
