export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set<string>();
  for (const [x, y] of cells) {
    living.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();
  const positions = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
        if (!positions.has(k)) {
          positions.set(k, [nx, ny]);
        }
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = living.has(k);
    if (count === 3 || (count === 2 && isAlive)) {
      result.push(positions.get(k)!);
    }
  }

  return result;
}
