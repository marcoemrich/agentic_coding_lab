export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const countNeighbors = (liveSet: Set<string>, x: number, y: number): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) => liveSet.has(key(x + dx, y + dy))).length;

const survives = (isLive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isLive && neighborCount === 2);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([x, y]) => key(x, y)));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of [[0, 0], ...NEIGHBOR_OFFSETS]) {
      const cx = x + dx;
      const cy = y + dy;
      candidates.set(key(cx, cy), [cx, cy]);
    }
  }
  const result: Cell[] = [];
  for (const [k, [x, y]] of candidates) {
    if (survives(liveSet.has(k), countNeighbors(liveSet, x, y))) {
      result.push([x, y]);
    }
  }
  return result;
};
