function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(liveCells: [number, number][]): [number, number][] {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: [number, number][] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = liveSet.has(key);
    if (count === 3 || (isAlive && count === 2)) {
      result.push(parseKey(key));
    }
  }

  return result;
}
