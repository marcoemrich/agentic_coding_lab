export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveNextGeneration = (isAliveNow: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAliveNow && liveNeighborCount === 2);

type Candidate = { cell: Cell; isAliveNow: boolean; liveNeighborCount: number };

function candidatesForNextGeneration(liveCells: Cell[]): Candidate[] {
  const aliveKeys = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Candidate>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const existing = candidates.get(key);
      if (existing) existing.liveNeighborCount += 1;
      else candidates.set(key, { cell, isAliveNow: aliveKeys.has(key), liveNeighborCount: 1 });
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return candidatesForNextGeneration(liveCells)
    .filter(({ isAliveNow, liveNeighborCount }) => isAliveNextGeneration(isAliveNow, liveNeighborCount))
    .map(({ cell }) => cell);
}
