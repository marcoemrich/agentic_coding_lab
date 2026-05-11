function neighborsOf(x: number, y: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
}

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: [number, number][]): [number, number][] {
  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));

  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    candidates.add(toKey(x, y));
    for (const [nx, ny] of neighborsOf(x, y)) {
      candidates.add(toKey(nx, ny));
    }
  }

  const result: [number, number][] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    const liveNeighborCount = neighborsOf(x, y).filter(([nx, ny]) =>
      liveSet.has(toKey(nx, ny))
    ).length;
    const alive = liveSet.has(key);
    const shouldLive =
      liveNeighborCount === 3 || (alive && liveNeighborCount === 2);
    if (shouldLive) {
      result.push([x, y]);
    }
  }

  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return result;
}
