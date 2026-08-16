export type Cell = [number, number];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentLiveCells.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of currentLiveCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const cell: Cell = [x + dx, y + dy];
        const key = coordinateKey(...cell);
        const candidate = neighborCounts.get(key);
        neighborCounts.set(key, { cell, count: (candidate?.count ?? 0) + 1 });
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && liveCellKeys.has(key))) {
      next.push(cell);
    }
  }
  return next.sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
