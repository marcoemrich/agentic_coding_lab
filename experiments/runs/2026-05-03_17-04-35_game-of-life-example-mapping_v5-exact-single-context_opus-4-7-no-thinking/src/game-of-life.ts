export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const willBeAlive = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }

  const result: Cell[] = [];
  for (const cell of candidates.values()) {
    const liveNeighborCount = neighborsOf(cell).filter((n) =>
      liveSet.has(cellKey(n))
    ).length;
    if (willBeAlive(liveSet.has(cellKey(cell)), liveNeighborCount)) {
      result.push(cell);
    }
  }
  return result;
};
