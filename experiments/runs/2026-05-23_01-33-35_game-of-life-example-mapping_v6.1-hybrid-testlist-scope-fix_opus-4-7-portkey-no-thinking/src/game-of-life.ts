export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

function countLiveNeighbors(liveCells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const existing = counts.get(key);
      if (existing) existing.count++;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = countLiveNeighbors(liveCells);

  const survivors: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    const isAlive = liveKeys.has(key);
    if (count === 3 || (isAlive && count === 2)) survivors.push(cell);
  }
  return survivors;
}
