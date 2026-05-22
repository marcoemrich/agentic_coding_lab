export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

function countLiveNeighbors(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = toKey(neighbor);
      const entry = counts.get(k);
      if (entry) entry.count++;
      else counts.set(k, { cell: neighbor, count: 1 });
    }
  }
  return counts;
}

const survives = (isAlive: boolean, neighbors: number): boolean =>
  isAlive ? neighbors === 2 || neighbors === 3 : neighbors === 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(aliveKeys.has(k), count)) nextCells.push(cell);
  }
  return nextCells;
}
