export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(liveCells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = cellKey(neighbor);
      const entry = counts.get(k) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      counts.set(k, entry);
    }
  }
  return counts;
}

function survives(liveNeighbors: number, isAlive: boolean): boolean {
  return liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  return Array.from(countLiveNeighbors(liveCells).values())
    .filter(({ cell, count }) => survives(count, liveKeys.has(cellKey(cell))))
    .map(({ cell }) => cell);
}
