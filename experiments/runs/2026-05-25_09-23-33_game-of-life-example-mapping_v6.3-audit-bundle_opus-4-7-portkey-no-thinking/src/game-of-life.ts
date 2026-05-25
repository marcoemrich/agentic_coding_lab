export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const survivesOrIsBorn = (liveNeighbors: number, wasAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && wasAlive);

type NeighborTally = Map<string, { cell: Cell; liveNeighbors: number }>;

function tallyLiveNeighbors(cells: Cell[]): NeighborTally {
  const tally: NeighborTally = new Map();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = keyOf(nx, ny);
      const entry = tally.get(key);
      tally.set(key, { cell: [nx, ny], liveNeighbors: (entry?.liveNeighbors ?? 0) + 1 });
    }
  }
  return tally;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const tally = tallyLiveNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, { cell, liveNeighbors }] of tally) {
    if (survivesOrIsBorn(liveNeighbors, liveKeys.has(key))) {
      nextCells.push(cell);
    }
  }
  return nextCells;
}
