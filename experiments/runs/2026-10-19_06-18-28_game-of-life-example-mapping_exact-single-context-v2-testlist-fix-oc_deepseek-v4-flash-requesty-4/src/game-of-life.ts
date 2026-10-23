export type Cell = [number, number];

const REPRODUCE = 3;
const SURVIVE = 2;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));

  const countNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.reduce(
      (n, [dx, dy]) => n + (live.has(key(x + dx, y + dy)) ? 1 : 0),
      0
    );

  const candidates = new Set<string>(live);
  for (const [x, y] of cells) {
    NEIGHBOR_OFFSETS.forEach(([dx, dy]) => candidates.add(key(x + dx, y + dy)));
  }

  const next: Cell[] = [];
  for (const c of candidates) {
    const [x, y] = c.split(",").map(Number);
    const n = countNeighbors(x, y);
    if (n === REPRODUCE || (live.has(c) && n === SURVIVE)) {
      next.push([x, y]);
    }
  }

  return next;
}