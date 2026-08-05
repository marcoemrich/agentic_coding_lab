export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

// Game of Life rules: a live cell survives with 2-3 neighbors;
// a dead cell is born with exactly 3 neighbors.
const isAliveInNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const countLiveNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => live.has(cellKey(x + dx, y + dy))).length;

  // Only cells adjacent to live cells (and live cells themselves) can change.
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    candidates.add(cellKey(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(cellKey(x + dx, y + dy));
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number);
    if (isAliveInNextGeneration(live.has(key), countLiveNeighbors(x, y))) {
      next.push([x, y]);
    }
  }
  return next;
}
