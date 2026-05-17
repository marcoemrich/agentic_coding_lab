export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));

  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) entry.count++;
      else neighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    const survives = count === 3 || (count === 2 && aliveKeys.has(key));
    if (survives) nextCells.push(cell);
  }
  return nextCells;
}
