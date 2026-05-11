export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<string>();
  for (const [x, y] of cells) {
    liveCells.add(cellKey(x, y));
  }

  const neighborCounts = new Map<string, { x: number; y: number; count: number }>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = cellKey(nx, ny);
        const existing = neighborCounts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          neighborCounts.set(key, { x: nx, y: ny, count: 1 });
        }
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, { x, y, count }] of neighborCounts) {
    const isAlive = liveCells.has(key);
    if (isAlive && (count === 2 || count === 3)) {
      nextCells.push([x, y]);
    } else if (!isAlive && count === 3) {
      nextCells.push([x, y]);
    }
  }

  return nextCells;
}
