export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const willLive = (neighborCount: number, isLiving: boolean): boolean =>
  neighborCount === REPRODUCTION_NEIGHBORS
  || (neighborCount === SURVIVAL_NEIGHBORS && isLiving);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + deltaX, y + deltaY);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (willLive(count, living.has(key))) {
      const [x, y] = key.split(",").map(Number);
      nextCells.push([x, y]);
    }
  }

  return nextCells.sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
