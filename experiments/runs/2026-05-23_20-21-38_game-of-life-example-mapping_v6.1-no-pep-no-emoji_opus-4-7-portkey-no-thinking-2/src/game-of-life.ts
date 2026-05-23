/** A live cell's coordinates on the infinite grid: [x, y]. */
export type Cell = [x: number, y: number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

/** Conway's rule: a cell lives next tick if it has 3 live neighbors, or 2 and is already alive. */
const isAliveNextTick = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) entry.count += 1;
      else neighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAliveNextTick(liveKeys.has(key), count)) nextCells.push(cell);
  }
  return nextCells;
}
