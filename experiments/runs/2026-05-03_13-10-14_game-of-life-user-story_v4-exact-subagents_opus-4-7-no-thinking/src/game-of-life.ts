export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survivesWith = (neighbors: number): boolean => neighbors === 2 || neighbors === 3;

const isBornWith = (neighbors: number): boolean => neighbors === 3;

export const nextGeneration = (livingCells: readonly Cell[]): Cell[] => {
  const livingKeys = new Set(livingCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => livingKeys.has(cellKey(cell));
  const livingNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const survivors = livingCells.filter((cell) => survivesWith(livingNeighborCount(cell)));

  const bornCandidates = new Map<string, Cell>();
  for (const neighbor of livingCells.flatMap(neighborsOf)) {
    if (!isAlive(neighbor)) {
      bornCandidates.set(cellKey(neighbor), neighbor);
    }
  }
  const born = [...bornCandidates.values()].filter((cell) =>
    isBornWith(livingNeighborCount(cell))
  );

  return [...survivors, ...born];
};
