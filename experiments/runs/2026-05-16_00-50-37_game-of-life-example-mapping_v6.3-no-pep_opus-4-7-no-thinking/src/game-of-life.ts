export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveKeys = new Set(cells.map(cellKey));
  const candidates = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = cellKey(neighbor);
      const existing = candidates.get(k);
      candidates.set(k, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of candidates) {
    if (survives(liveKeys.has(k), count)) {
      result.push(cell);
    }
  }

  return result;
};
