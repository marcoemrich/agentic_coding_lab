export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(liveCells);

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  const next: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(key, count)) next.push(cell);
  }
  return next;
}

function countNeighbors(
  liveCells: Cell[],
): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor[0], neighbor[1]);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
}
