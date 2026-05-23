export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  (isAlive && neighborCount === 2) || neighborCount === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const candidates = new Map<string, { cell: Cell; neighborCount: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const existing = candidates.get(key);
      candidates.set(key, {
        cell,
        neighborCount: (existing?.neighborCount ?? 0) + 1,
      });
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, { cell, neighborCount }] of candidates) {
    if (survives(liveKeys.has(key), neighborCount)) {
      nextCells.push(cell);
    }
  }

  return nextCells;
}
