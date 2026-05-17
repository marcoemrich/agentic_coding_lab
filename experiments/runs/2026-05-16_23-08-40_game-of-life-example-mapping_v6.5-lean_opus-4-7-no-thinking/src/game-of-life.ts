export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(cell: Cell, liveKeys: Set<string>): number {
  return neighborsOf(cell).filter((n) => liveKeys.has(cellKey(n))).length;
}

function willBeLive(cell: Cell, liveKeys: Set<string>): boolean {
  const liveNeighbors = countLiveNeighbors(cell, liveKeys);
  return liveNeighbors === 3 || (liveNeighbors === 2 && liveKeys.has(cellKey(cell)));
}

function candidateCells(cells: Cell[]): Cell[] {
  const seen = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of [cell, ...neighborsOf(cell)]) {
      seen.set(cellKey(candidate), candidate);
    }
  }
  return [...seen.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((cell) => willBeLive(cell, liveKeys));
}
