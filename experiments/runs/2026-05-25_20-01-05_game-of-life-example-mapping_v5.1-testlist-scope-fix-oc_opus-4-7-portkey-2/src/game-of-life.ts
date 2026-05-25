export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));

  // For each living cell, increment the neighbor count for each of its 8 neighbors.
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const k = keyOf(neighbor);
        const entry = neighborCounts.get(k);
        if (entry) entry.count++;
        else neighborCounts.set(k, { cell: neighbor, count: 1 });
      }
    }
  }

  // A cell is alive in the next generation when:
  //  - it has exactly 3 live neighbors (reproduction, or survival of a 3-neighbor live cell), or
  //  - it is currently alive and has exactly 2 live neighbors (survival).
  const isAliveNext = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && alive.has(k));

  const next: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (isAliveNext(k, count)) next.push(cell);
  }
  return next;
}
