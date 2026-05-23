export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveNextGeneration = (wasAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (wasAlive && neighbors === 2);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        neighborCounts.set(key, { cell: neighbor, count: 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAliveNextGeneration(liveKeys.has(key), count)) {
      result.push(cell);
    }
  }
  return result;
}
