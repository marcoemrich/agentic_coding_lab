export type Cell = [x: number, y: number];

const cellKey = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(currentLivingCells: Cell[]): Cell[] {
  const living = new Set(currentLivingCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of currentLivingCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = cellKey(x + dx, y + dy);
        neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && living.has(key))) {
      const [x, y] = key.split(",").map(Number);
      next.push([x, y]);
    }
  }
  return next;
}
