type Cell = [number, number]; // [x, y]

function countLiveNeighbors(liveSet: Set<string>, x: number, y: number): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(`${x + dx},${y + dy}`)) count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(([x, y]) => `${x},${y}`));
  const nextSet = new Set<string>();

  // Check each live cell for survival
  for (const [x, y] of cells) {
    const neighbors = countLiveNeighbors(liveSet, x, y);
    if (neighbors >= 2 && neighbors <= 3) nextSet.add(`${x},${y}`);
  }

  // Check dead neighbors for reproduction
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        candidates.add(`${x + dx},${y + dy}`);
      }
    }
  }

  for (const key of candidates) {
    if (liveSet.has(key)) continue;
    const [x, y] = key.split(",").map(Number);
    if (countLiveNeighbors(liveSet, x, y) === 3) nextSet.add(key);
  }

  return Array.from(nextSet).map((key) => key.split(",").map(Number) as Cell);
}
