export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

/**
 * Tallies, for every cell adjacent to at least one live cell, how many live
 * neighbors it has. Cells absent from the tally have zero live neighbors, so
 * they can never be born and need not be considered.
 */
const countLiveNeighbors = (liveCells: Cell[]): Map<string, [Cell, number]> => {
  const tally = new Map<string, [Cell, number]>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = cellKey(neighbor);
      const [, count] = tally.get(key) ?? [neighbor, 0];
      tally.set(key, [neighbor, count + 1]);
    }
  }
  return tally;
};

// Conway's thresholds: fewer than MIN is underpopulation, more than MAX is
// overpopulation, and a dead cell with exactly REPRODUCTION neighbors is born.
const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_FOR_REPRODUCTION = 3;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
  liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const isBorn = (liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_FOR_REPRODUCTION;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const livingKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = countLiveNeighbors(liveCells);

  const nextLiveCells: Cell[] = [];
  for (const [key, [cell, liveNeighbors]] of neighborCounts) {
    const wasAlive = livingKeys.has(key);
    if (wasAlive ? survives(liveNeighbors) : isBorn(liveNeighbors)) {
      nextLiveCells.push(cell);
    }
  }
  return nextLiveCells;
}
