export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<string>(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (isAliveNextGeneration(count, liveCells.has(key))) {
      next.push(parseCellKey(key));
    }
  }
  return next;
}

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function isAliveNextGeneration(liveNeighbors: number, isCurrentlyAlive: boolean): boolean {
  return liveNeighbors === 3 || (liveNeighbors === 2 && isCurrentlyAlive);
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [xs, ys] = key.split(",");
  return [Number(xs), Number(ys)];
}
