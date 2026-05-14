export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const parseKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Array<Cell> =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNextGeneration = (
  liveNeighborCount: number,
  wasAlive: boolean,
): boolean => liveNeighborCount === 3 || (liveNeighborCount === 2 && wasAlive);

export function nextGeneration(cells: Array<Cell>): Array<Cell> {
  const liveSet = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(neighborCounts)
    .filter(([key, count]) => isAliveNextGeneration(count, liveSet.has(key)))
    .map(([key]) => parseKey(key));
}
