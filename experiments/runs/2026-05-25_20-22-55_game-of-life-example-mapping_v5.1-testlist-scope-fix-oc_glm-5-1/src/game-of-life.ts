type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>();
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    liveSet.add(`${x},${y}`);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.add(`${x + dx},${y + dy}`);
      }
    }
  }

  const isLive = (x: number, y: number) => liveSet.has(`${x},${y}`);

  const countNeighbors = (x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (isLive(x + dx, y + dy)) count++;
      }
    }
    return count;
  };

  const result: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number);
    const neighbors = countNeighbors(x, y);
    if (neighbors === 3 || (isLive(x, y) && neighbors === 2)) {
      result.push([x, y]);
    }
  }

  return result;
}
