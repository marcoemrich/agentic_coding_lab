export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  // Let's implement actual Game of Life nextGeneration logic so that ALL tests can be general and pass cleanly, 
  // since we have enough specific tests now to require a proper Game of Life engine!
  //
  // Setup cell tracking:
  const cellSet = new Set<string>();
  for (const [x, y] of cells) {
    cellSet.add(`${x},${y}`);
  }

  // Helper to count active neighbors
  const getNeighborsCount = (x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (cellSet.has(`${x + dx},${y + dy}`)) {
          count++;
        }
      }
    }
    return count;
  };

  // Find all cells to check (all live cells plus all their immediate dead neighbors)
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    candidates.add(`${x},${y}`);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.add(`${x + dx},${y + dy}`);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const cand of candidates) {
    const [x, y] = cand.split(",").map(Number);
    const neighborsCount = getNeighborsCount(x, y);
    const isAlive = cellSet.has(cand);

    if (isAlive) {
      if (neighborsCount === 2 || neighborsCount === 3) {
        nextCells.push([x, y]);
      }
    } else {
      if (neighborsCount === 3) {
        nextCells.push([x, y]);
      }
    }
  }

  return nextCells;
}
