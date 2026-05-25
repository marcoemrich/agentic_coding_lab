export type Cell = [number, number];

const keyOf = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();
  const positions = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = keyOf(nx, ny);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
        positions.set(key, [nx, ny]);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveSet.has(key))) {
      nextCells.push(positions.get(key)!);
    }
  }

  return nextCells;
}
