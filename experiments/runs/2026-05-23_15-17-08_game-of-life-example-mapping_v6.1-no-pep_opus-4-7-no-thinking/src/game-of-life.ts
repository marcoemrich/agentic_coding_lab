export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const aliveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => aliveKeys.has(cellKey(cell));
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;
  const survivesOrIsBorn = (cell: Cell): boolean => {
    const count = liveNeighborCount(cell);
    const born = count === 3;
    const survives = count === 2 && isAlive(cell);
    return born || survives;
  };

  const candidates = uniqueCells([
    ...liveCells,
    ...liveCells.flatMap(neighborsOf),
  ]);
  return candidates.filter(survivesOrIsBorn);
};
