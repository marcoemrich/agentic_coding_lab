export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  // Only cells adjacent to living cells can survive or be born.
  for (const coordinate of living) {
    const [x, y] = coordinate.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = key(x + dx, y + dy);
        neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [coordinate, count] of neighborCounts) {
    if (count === 3 || (count === 2 && living.has(coordinate))) {
      const [x, y] = coordinate.split(',').map(Number);
      next.push([x, y]);
    }
  }
  return next;
}
