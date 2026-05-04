export function nextGeneration(cells: Array<[number, number]>): Array<[number, number]> {
  if (cells.length === 0) {
    return [];
  }

  // Create a set for O(1) lookup of living cells
  const livingCells = new Set(cells.map(([x, y]) => `${x},${y}`));

  // We need to check all living cells and their neighbors
  const cellsToCheck = new Set<string>();

  // Add all living cells and their neighbors to the set of cells to check
  for (const [x, y] of cells) {
    cellsToCheck.add(`${x},${y}`);
    // Add all 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          cellsToCheck.add(`${x + dx},${y + dy}`);
        }
      }
    }
  }

  const nextGen: Array<[number, number]> = [];

  // Check each cell
  for (const cellStr of cellsToCheck) {
    const [x, y] = cellStr.split(',').map(Number) as [number, number];
    const isAlive = livingCells.has(cellStr);
    const liveNeighborCount = countLiveNeighbors(x, y, livingCells);

    // Apply Game of Life rules
    if (isAlive) {
      // Rule 2: Survival - live cell with 2 or 3 neighbors survives
      if (liveNeighborCount === 2 || liveNeighborCount === 3) {
        nextGen.push([x, y]);
      }
      // Rule 1: Underpopulation - live cell with < 2 neighbors dies
      // Rule 3: Overpopulation - live cell with > 3 neighbors dies
      // (implicitly handled by not adding to nextGen)
    } else {
      // Rule 4: Reproduction - dead cell with exactly 3 neighbors becomes alive
      if (liveNeighborCount === 3) {
        nextGen.push([x, y]);
      }
    }
  }

  // Sort the result for consistent ordering (optional but helps with testing)
  nextGen.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  return nextGen;
}

function countLiveNeighbors(x: number, y: number, livingCells: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself
      if (livingCells.has(`${x + dx},${y + dy}`)) {
        count++;
      }
    }
  }
  return count;
}
