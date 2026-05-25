export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
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

function survives(liveNeighborCount: number): boolean {
  return liveNeighborCount === 2 || liveNeighborCount === 3;
}

function isBorn(liveNeighborCount: number): boolean {
  return liveNeighborCount === 3;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const aliveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell) => aliveKeys.has(cellKey(cell));
  const liveNeighborCount = (cell: Cell) => neighborsOf(cell).filter(isAlive).length;

  const candidates = new Map<string, Cell>();
  for (const cell of liveCells) {
    for (const candidate of [cell, ...neighborsOf(cell)]) {
      candidates.set(cellKey(candidate), candidate);
    }
  }

  return [...candidates.values()].filter((cell) => {
    const count = liveNeighborCount(cell);
    return isAlive(cell) ? survives(count) : isBorn(count);
  });
}
