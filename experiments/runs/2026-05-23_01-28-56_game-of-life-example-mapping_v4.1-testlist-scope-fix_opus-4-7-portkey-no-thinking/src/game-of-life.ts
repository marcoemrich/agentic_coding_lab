type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveInNextGeneration = (isCurrentlyAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);

export function nextGeneration(cells: Array<Cell>): Array<Cell> {
  const liveKeys = new Set(cells.map(toKey));

  const neighborCounts = new Map<string, [Cell, number]>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = toKey(neighbor);
      const existing = neighborCounts.get(key);
      neighborCounts.set(key, [neighbor, (existing?.[1] ?? 0) + 1]);
    }
  }

  const nextLiveCells: Array<Cell> = [];
  for (const [key, [cell, count]] of neighborCounts) {
    if (isAliveInNextGeneration(liveKeys.has(key), count)) {
      nextLiveCells.push(cell);
    }
  }

  return nextLiveCells;
}
