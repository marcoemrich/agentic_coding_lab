export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count live neighbors for each cell that touches a live cell
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = alive.has(k);
    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      const [xs, ys] = k.split(',');
      result.push([Number(xs), Number(ys)]);
    }
  }

  return result;
}
