export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const key = (x: number, y: number) => `${x},${y}`;
  const alive = new Set(cells.map(([x, y]) => key(x, y)));
  const neighbourCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        neighbourCounts.set(k, (neighbourCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, neighbours] of neighbourCounts) {
    const wasAlive = alive.has(k);
    const livesNext =
      (wasAlive && (neighbours === 2 || neighbours === 3)) ||
      (!wasAlive && neighbours === 3);
    if (livesNext) {
      const [x, y] = k.split(",").map(Number);
      nextCells.push([x, y]);
    }
  }

  return nextCells;
}
