export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const k = cellKey(neighbor);
        const existing = neighborCounts.get(k);
        neighborCounts.set(k, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(aliveKeys.has(k), count)) result.push(cell);
  }
  return result;
}
