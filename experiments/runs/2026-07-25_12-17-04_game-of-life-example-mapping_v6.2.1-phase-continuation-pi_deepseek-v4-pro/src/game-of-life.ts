const keyOf = (x: number, y: number): string => `${x},${y}`;
const parseKey = (key: string): [number, number] =>
  key.split(",").map(Number) as [number, number];

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;
const isBorn = (neighborCount: number): boolean => neighborCount === 3;

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: [number, number][]): [number, number][] {
  if (cells.length === 0) return [];

  const cellSet = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [cx, cy] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = keyOf(cx + dx, cy + dy);
      neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
    }
  }

  const next: [number, number][] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = parseKey(key);
    const alive = cellSet.has(key);
    if (alive ? survives(count) : isBorn(count)) {
      next.push([x, y]);
    }
  }

  return next;
}