export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  (isAlive && neighborCount === 2) || neighborCount === 3;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: readonly Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();
  const cellsByKey = new Map<string, Cell>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      cellsByKey.set(key, neighbor);
    }
  }

  return Array.from(neighborCounts)
    .filter(([key, count]) => survives(aliveKeys.has(key), count))
    .map(([key]) => cellsByKey.get(key)!);
}
