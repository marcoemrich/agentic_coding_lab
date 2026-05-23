export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  isAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;

const countNeighbors = (cells: Cell[]): Map<string, { cell: Cell; count: number }> => {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(aliveKeys.has(key), count)) result.push(cell);
  }
  return result;
}
