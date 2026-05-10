export function nextGeneration(liveCells: Set<string>): Set<string> {
  const result = new Set<string>();

  // Get all cells to consider: living cells and their neighbors
  const cellsToConsider = new Set<string>();

  for (const cell of liveCells) {
    cellsToConsider.add(cell);

    // Add all neighbors
    const [x, y] = cell.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        cellsToConsider.add(`${x + dx},${y + dy}`);
      }
    }
  }

  // Apply rules to each cell
  for (const cell of cellsToConsider) {
    const liveNeighbors = countLiveNeighbors(cell, liveCells);
    const isAlive = liveCells.has(cell);

    if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
      result.add(cell);
    } else if (!isAlive && liveNeighbors === 3) {
      result.add(cell);
    }
  }

  return result;
}

function countLiveNeighbors(cell: string, liveCells: Set<string>): number {
  const [x, y] = cell.split(',').map(Number);
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveCells.has(`${x + dx},${y + dy}`)) {
        count++;
      }
    }
  }

  return count;
}
