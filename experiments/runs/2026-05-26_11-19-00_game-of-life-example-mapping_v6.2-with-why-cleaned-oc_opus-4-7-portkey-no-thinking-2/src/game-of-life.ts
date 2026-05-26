export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseCell = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

// Conway's rule: a cell is alive next generation iff it has exactly 3 live
// neighbors, or it is currently alive and has exactly 2 live neighbors.
const willBeAlive = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isCurrentlyAlive && liveNeighborCount === 2);

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

// For each live cell, increment the neighbor count of each of its 8 neighbors.
// The resulting map's keys are exactly the candidate cells for the next
// generation (any cell that could possibly be alive next gen).
const countLiveNeighbors = (liveCells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = cellKey(x + dx, y + dy);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentGeneration.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countLiveNeighbors(currentGeneration);

  const nextGen: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (willBeAlive(liveCellKeys.has(key), count)) {
      nextGen.push(parseCell(key));
    }
  }
  return nextGen;
}
