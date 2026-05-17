type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors === 2 || liveNeighbors === 3;
}

function isBorn(liveNeighbors: number): boolean {
  return liveNeighbors === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighborsAroundLiveCells(cells);

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const wasAlive = liveCells.has(key);
    if (wasAlive ? survives(count) : isBorn(count)) {
      nextCells.push(parseKey(key));
    }
  }
  return nextCells;
}

function countNeighborsAroundLiveCells(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function parseKey(key: string): Cell {
  const [xs, ys] = key.split(",");
  return [Number(xs), Number(ys)];
}
