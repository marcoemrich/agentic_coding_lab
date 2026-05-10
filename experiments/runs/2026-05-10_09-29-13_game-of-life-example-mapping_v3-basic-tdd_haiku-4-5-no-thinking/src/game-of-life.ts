export function nextGeneration(current: Set<string>): Set<string> {
  const next = new Set<string>();

  // Get all cells that need to be checked: live cells + their neighbors
  const cellsToCheck = new Set<string>();

  for (const cellStr of current) {
    const [x, y] = cellStr.split(',').map(Number);
    // Add the cell itself
    cellsToCheck.add(cellStr);
    // Add all 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        cellsToCheck.add(`${x + dx},${y + dy}`);
      }
    }
  }

  // Also check neighbors of live cells (for reproduction rule)
  const neighborsToCheck = new Set<string>();
  for (const cellStr of cellsToCheck) {
    const [x, y] = cellStr.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        neighborsToCheck.add(`${x + dx},${y + dy}`);
      }
    }
  }

  // Combine all cells to check
  const allCellsToCheck = new Set([...cellsToCheck, ...neighborsToCheck]);

  // Apply rules to each cell
  for (const cellStr of allCellsToCheck) {
    const liveNeighbors = countLiveNeighbors(cellStr, current);
    const isAlive = current.has(cellStr);

    if (isAlive) {
      // Survival: 2 or 3 live neighbors
      if (liveNeighbors === 2 || liveNeighbors === 3) {
        next.add(cellStr);
      }
      // Underpopulation (< 2) or Overpopulation (> 3): cell dies
    } else {
      // Reproduction: exactly 3 live neighbors
      if (liveNeighbors === 3) {
        next.add(cellStr);
      }
    }
  }

  return next;
}

function countLiveNeighbors(cellStr: string, current: Set<string>): number {
  const [x, y] = cellStr.split(',').map(Number);
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (current.has(`${x + dx},${y + dy}`)) {
        count++;
      }
    }
  }

  return count;
}
