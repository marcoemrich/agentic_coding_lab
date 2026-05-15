export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  // Count neighbors for every cell that is a neighbor of a live cell
  const neighborCounts = new Map<string, number>();
  const positions = new Map<string, Cell>();

  for (const cellKey of live) {
    const [xStr, yStr] = cellKey.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const nk = key(nx, ny);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
        if (!positions.has(nk)) positions.set(nk, [nx, ny]);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = live.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      result.push(positions.get(k)!);
    } else if (!isAlive && count === 3) {
      result.push(positions.get(k)!);
    }
  }

  return result;
}
