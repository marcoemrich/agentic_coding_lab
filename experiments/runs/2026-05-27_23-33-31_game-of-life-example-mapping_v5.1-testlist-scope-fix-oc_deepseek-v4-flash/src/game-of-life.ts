type Cell = [number, number];

const neighbors = (cx: number, cy: number): Cell[] => {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([cx + dx, cy + dy]);
    }
  }
  return result;
};

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number => {
  let count = 0;
  for (const [nx, ny] of neighbors(cell[0], cell[1])) {
    if (liveSet.has(`${nx},${ny}`)) count++;
  }
  return count;
};

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];

  const liveSet = new Set<string>();
  for (const [x, y] of cells) {
    liveSet.add(cellKey(x, y));
  }

  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    candidates.add(cellKey(x, y));
    for (const [nx, ny] of neighbors(x, y)) {
      candidates.add(cellKey(nx, ny));
    }
  }

  const result: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number);
    const liveNeighbors = countLiveNeighbors([x, y], liveSet);
    const isAlive = liveSet.has(key);

    if (liveNeighbors === 3 || (isAlive && liveNeighbors === 2)) {
      result.push([x, y]);
    }
  }

  return result.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}