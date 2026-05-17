export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isLive: boolean, neighbors: number): boolean =>
  isLive ? neighbors === 2 || neighbors === 3 : neighbors === 3;

type CandidateEntry = { cell: Cell; neighbors: number };

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const candidates = new Map<string, CandidateEntry>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const k = keyOf(cell);
      const prior = candidates.get(k)?.neighbors ?? 0;
      candidates.set(k, { cell, neighbors: prior + 1 });
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, neighbors }] of candidates) {
    if (survives(liveKeys.has(k), neighbors)) {
      result.push(cell);
    }
  }
  return result;
}
