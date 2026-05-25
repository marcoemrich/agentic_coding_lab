export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function survives(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(cellKey));
  const neighbors = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const k = cellKey(cell);
      const existing = neighbors.get(k);
      neighbors.set(k, { cell, count: (existing?.count ?? 0) + 1 });
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighbors) {
    if (survives(liveSet.has(k), count)) {
      result.push(cell);
    }
  }
  return result;
}
