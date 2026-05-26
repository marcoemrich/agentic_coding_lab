export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

type NeighborTally = { cell: Cell; liveNeighborCount: number };

const tallyLiveNeighborsPerCandidate = (liveCells: Cell[]): Map<string, NeighborTally> => {
  const tallies = new Map<string, NeighborTally>();
  for (const liveCell of liveCells) {
    for (const candidate of neighborsOf(liveCell)) {
      const key = cellKey(candidate);
      const existing = tallies.get(key);
      if (existing) {
        existing.liveNeighborCount += 1;
      } else {
        tallies.set(key, { cell: candidate, liveNeighborCount: 1 });
      }
    }
  }
  return tallies;
};

// Conway's rules unified: a cell is alive next generation if it has exactly
// 3 live neighbors (birth or survival), or it was alive and has exactly 2
// (survival only).
const isAliveNextGeneration = (wasAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (wasAlive && liveNeighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const tallies = tallyLiveNeighborsPerCandidate(cells);

  const nextGen: Cell[] = [];
  for (const [key, { cell, liveNeighborCount }] of tallies) {
    if (isAliveNextGeneration(liveKeys.has(key), liveNeighborCount)) {
      nextGen.push(cell);
    }
  }
  return nextGen;
}
