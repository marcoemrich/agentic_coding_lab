export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(x: number, y: number, liveSet: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(cellKey(x + dx, y + dy))) count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const surviving = cells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y, liveSet);
    return neighbors === 2 || neighbors === 3;
  });

  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        if (!liveSet.has(key)) candidates.add(key);
      }
    }
  }

  const born: Cell[] = [];
  for (const key of candidates) {
    const [xs, ys] = key.split(",");
    const x = parseInt(xs);
    const y = parseInt(ys);
    if (countLiveNeighbors(x, y, liveSet) === 3) born.push([x, y]);
  }

  return [...surviving, ...born];
}