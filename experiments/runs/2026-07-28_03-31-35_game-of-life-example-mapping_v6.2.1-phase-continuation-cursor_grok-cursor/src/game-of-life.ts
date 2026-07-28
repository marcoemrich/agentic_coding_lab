type Cell = [number, number];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighbors([x, y]: Cell, liveSet: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(cellKey([x + dx, y + dy]))) {
        count++;
      }
    }
  }
  return count;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Cell>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const candidate: Cell = [x + dx, y + dy];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, cell] of candidates) {
    const neighbors = countLiveNeighbors(cell, liveSet);
    const isAlive = liveSet.has(key);
    if (neighbors === 3 || (isAlive && neighbors === 2)) {
      next.push(cell);
    }
  }
  return next;
}
