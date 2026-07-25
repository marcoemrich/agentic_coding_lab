type Cell = [number, number]; // [x, y]

// The 8 cells surrounding any cell (Moore neighborhood).
const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

// Conway's rules: a cell is alive next generation if it has exactly 3 live
// neighbors (reproduction), or 2 live neighbors while already alive (survival).
function willBeAlive(liveNeighbors: number, isAlive: boolean): boolean {
  return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const key = (x: number, y: number): string => `${x},${y}`;
  const living = new Set(cells.map(([x, y]) => key(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = key(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (willBeAlive(count, living.has(k))) {
      const [x, y] = k.split(",").map(Number);
      next.push([x, y]);
    }
  }
  return next;
}
