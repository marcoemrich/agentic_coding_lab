export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const key = keyOf(neighbor);
        const entry = neighborCounts.get(key);
        if (entry) {
          entry.count++;
        } else {
          neighborCounts.set(key, { cell: neighbor, count: 1 });
        }
      }
    }
  }

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  const nextLiveCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survives(key, count)) nextLiveCells.push(cell);
  }
  return nextLiveCells;
}
