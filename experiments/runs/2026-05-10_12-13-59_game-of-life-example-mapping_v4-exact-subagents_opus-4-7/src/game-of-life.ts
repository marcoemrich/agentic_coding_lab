type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number =>
  neighborsOf(cell).filter(([nx, ny]) => liveSet.has(cellKey(nx, ny))).length;

const willBeAlive = (cell: Cell, liveSet: Set<string>): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, liveSet);
  const wasAlive = liveSet.has(cellKey(cell[0], cell[1]));
  return liveNeighbors === 3 || (wasAlive && liveNeighbors === 2);
};

const uniqueCandidates = (cells: Cell[]): Cell[] => {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of [cell, ...neighborsOf(cell)]) {
      candidates.set(cellKey(neighbor[0], neighbor[1]), neighbor);
    }
  }
  return [...candidates.values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));
  return uniqueCandidates(cells).filter((cell) => willBeAlive(cell, liveSet));
}
