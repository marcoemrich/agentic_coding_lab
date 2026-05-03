export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const countLivingNeighbors = (cell: Cell, livingSet: Set<string>): number => {
  const [x, y] = cell;
  return neighborOffsets.reduce(
    (count, [dx, dy]) => (livingSet.has(cellKey([x + dx, y + dy])) ? count + 1 : count),
    0,
  );
};

const getCandidateCells = (livingCells: Cell[]): Cell[] => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of neighborOffsets) {
      const candidate: Cell = [x + dx, y + dy];
      candidates.set(cellKey(candidate), candidate);
    }
    candidates.set(cellKey([x, y]), [x, y]);
  }
  return Array.from(candidates.values());
};

const livesInNextGeneration = (cell: Cell, livingSet: Set<string>): boolean => {
  const neighbors = countLivingNeighbors(cell, livingSet);
  return neighbors === 3 || (neighbors === 2 && livingSet.has(cellKey(cell)));
};

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const livingSet = new Set(livingCells.map(cellKey));
  return getCandidateCells(livingCells).filter((cell) => livesInNextGeneration(cell, livingSet));
};
