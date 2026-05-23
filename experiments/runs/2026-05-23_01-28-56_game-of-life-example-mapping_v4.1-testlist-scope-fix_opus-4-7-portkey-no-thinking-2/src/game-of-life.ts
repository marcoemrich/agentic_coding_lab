export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const shouldLive = (liveNeighborCount: number, isCurrentlyAlive: boolean): boolean =>
  liveNeighborCount === 3 || (liveNeighborCount === 2 && isCurrentlyAlive);

type NeighborTally = Map<string, { cell: Cell; liveNeighborCount: number }>;

const tallyLiveNeighbors = (livingCells: Cell[]): NeighborTally => {
  const tally: NeighborTally = new Map();
  for (const cell of livingCells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = cellKey(neighbor);
      const existing = tally.get(k);
      if (existing) existing.liveNeighborCount++;
      else tally.set(k, { cell: neighbor, liveNeighborCount: 1 });
    }
  }
  return tally;
};

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const liveKeys = new Set(livingCells.map(cellKey));
  const neighborTally = tallyLiveNeighbors(livingCells);

  const result: Cell[] = [];
  for (const [k, { cell, liveNeighborCount }] of neighborTally) {
    if (shouldLive(liveNeighborCount, liveKeys.has(k))) result.push(cell);
  }
  return result;
}
