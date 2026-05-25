type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [xs, ys] = key.split(",");
  return [Number(xs), Number(ys)];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighborKey = cellKey(x + dx, y + dy);
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
      }
    }
  }

  const survivesOrIsBorn = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(key, count)) {
      next.push(parseCellKey(key));
    }
  }

  return next;
}
