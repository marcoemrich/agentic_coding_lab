export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNextGeneration = (wasAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (wasAlive && liveNeighborCount === 2);

type CandidateTally = { cell: Cell; liveNeighborCount: number };

const tallyCandidatesFromLiveCells = (liveCells: Cell[]): Map<string, CandidateTally> => {
  const tallies = new Map<string, CandidateTally>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = cellKey(neighbor);
      const existing = tallies.get(key);
      if (existing) existing.liveNeighborCount++;
      else tallies.set(key, { cell: neighbor, liveNeighborCount: 1 });
    }
  }
  return tallies;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const nextLiveCells: Cell[] = [];
  for (const [key, { cell, liveNeighborCount }] of tallyCandidatesFromLiveCells(liveCells)) {
    if (isAliveNextGeneration(liveKeys.has(key), liveNeighborCount)) {
      nextLiveCells.push(cell);
    }
  }
  return nextLiveCells;
}
