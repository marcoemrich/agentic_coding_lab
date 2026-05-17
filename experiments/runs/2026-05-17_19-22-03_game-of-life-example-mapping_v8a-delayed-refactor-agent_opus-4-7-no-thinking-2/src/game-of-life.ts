type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(cellKey));
  const counts = new Map<string, number>();
  const byKey = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [x + dx, y + dy];
        const key = cellKey(neighbor);
        byKey.set(key, neighbor);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of counts) {
    if (count === 3 || (count === 2 && liveSet.has(key))) {
      result.push(byKey.get(key)!);
    }
  }

  return result;
}
