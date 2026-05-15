export type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const idx = k.indexOf(",");
  return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set<string>();
  for (const [x, y] of cells) {
    living.add(key(x, y));
  }

  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const alive = living.has(k);
    if (alive && (count === 2 || count === 3)) {
      result.push(parseKey(k));
    } else if (!alive && count === 3) {
      result.push(parseKey(k));
    }
  }

  return result;
}
