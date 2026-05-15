export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const willBeAlive = (isCurrentlyAlive: boolean, liveNeighbors: number): boolean =>
  isCurrentlyAlive
    ? liveNeighbors === 2 || liveNeighbors === 3
    : liveNeighbors === 3;

const cellsToEvaluate = (liveCells: Cell[]): Cell[] => {
  const candidates = new Map<string, Cell>();
  for (const cell of liveCells) {
    for (const candidate of [cell, ...neighborsOf(cell)]) {
      candidates.set(cellKey(candidate), candidate);
    }
  }
  return [...candidates.values()];
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCellKeys = new Set(cells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveCellKeys.has(cellKey(cell));
  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  return cellsToEvaluate(cells).filter((cell) =>
    willBeAlive(isAlive(cell), countLiveNeighbors(cell))
  );
};
