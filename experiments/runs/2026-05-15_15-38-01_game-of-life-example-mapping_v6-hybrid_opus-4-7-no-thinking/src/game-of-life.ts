export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const isAliveNext = (isAliveNow: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAliveNow && liveNeighbors === 2);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const existing = neighborCounts.get(key);
      neighborCounts.set(key, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAliveNext(liveCellKeys.has(key), count)) {
      result.push(cell);
    }
  }
  return result;
}
