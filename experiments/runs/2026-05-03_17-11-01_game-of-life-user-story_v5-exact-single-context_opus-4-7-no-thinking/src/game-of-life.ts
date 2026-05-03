export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const countLivingNeighbors = (cell: Cell, livingSet: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => livingSet.has(cellKey(neighbor))).length;

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const livingSet = new Set(livingCells.map(cellKey));

  const candidates = new Map<string, Cell>();
  for (const cell of livingCells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }

  return [...candidates.values()].filter((candidate) => {
    const count = countLivingNeighbors(candidate, livingSet);
    const alive = livingSet.has(cellKey(candidate));
    return count === 3 || (alive && count === 2);
  });
};
