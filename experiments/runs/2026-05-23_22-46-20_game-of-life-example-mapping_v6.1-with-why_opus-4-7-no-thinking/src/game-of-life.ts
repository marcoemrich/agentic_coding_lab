export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isAlive && neighbors === 2);

type Candidate = { cell: Cell; neighbors: number };

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const existing = candidates.get(key);
      if (existing) existing.neighbors++;
      else candidates.set(key, { cell, neighbors: 1 });
    }
  }

  const next: Cell[] = [];
  for (const [key, { cell, neighbors }] of candidates) {
    if (survives(aliveKeys.has(key), neighbors)) next.push(cell);
  }
  return next;
}
