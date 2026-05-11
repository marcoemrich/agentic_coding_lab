type Cell = [number, number];

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push(fromKey(key));
    }
  }

  return result;
}
