export type Cell = [x: number, y: number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const livesNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  isAlive ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y    ],             [x + 1, y    ],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

type Candidate = { readonly cell: Cell; readonly liveNeighbors: number };

const candidatesWithLiveNeighborCounts = (liveCells: readonly Cell[]): Map<string, Candidate> => {
  const candidates = new Map<string, Candidate>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = keyOf(neighbor);
      const priorCount = candidates.get(key)?.liveNeighbors ?? 0;
      candidates.set(key, { cell: neighbor, liveNeighbors: priorCount + 1 });
    }
  }
  return candidates;
};

export function nextGeneration(cells: readonly Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(keyOf));
  const survivors: Cell[] = [];
  for (const [key, { cell, liveNeighbors }] of candidatesWithLiveNeighborCounts(cells)) {
    if (livesNextGeneration(aliveKeys.has(key), liveNeighbors)) {
      survivors.push(cell);
    }
  }
  return survivors;
}
