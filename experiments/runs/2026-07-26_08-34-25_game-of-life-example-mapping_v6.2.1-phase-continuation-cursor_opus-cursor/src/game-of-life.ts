export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const survivesOrIsBorn = (neighbors: number, isAlive: boolean): boolean =>
  neighbors === 3 || (neighbors === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = key(x + dx, y + dy);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const [x, y] = k.split(",").map(Number);
    if (survivesOrIsBorn(count, living.has(k))) {
      next.push([x, y]);
    }
  }
  return next;
}
