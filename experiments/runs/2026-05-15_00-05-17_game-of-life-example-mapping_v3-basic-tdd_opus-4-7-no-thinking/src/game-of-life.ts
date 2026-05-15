export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of cells) {
    alive.add(key(x, y));
  }

  // Count neighbors for every cell adjacent to a live cell.
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
        if (!positions.has(k)) positions.set(k, [nx, ny]);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = alive.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      result.push(positions.get(k)!);
    } else if (!isAlive && count === 3) {
      result.push(positions.get(k)!);
    }
  }

  return result;
}
