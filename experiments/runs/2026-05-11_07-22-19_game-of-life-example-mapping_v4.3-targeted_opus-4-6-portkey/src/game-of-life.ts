export function nextGeneration(liveCells: [number, number][]): [number, number][] {
  const liveSet = new Set(liveCells.map(([x, y]) => `${x},${y}`));

  const candidates = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        candidates.set(key, (candidates.get(key) || 0) + 1);
      }
    }
  }

  const result: [number, number][] = [];
  for (const [key, count] of candidates) {
    const isAlive = liveSet.has(key);
    if (count === 3 || (isAlive && count === 2)) {
      const [x, y] = key.split(",").map(Number);
      result.push([x, y]);
    }
  }

  return result;
}
