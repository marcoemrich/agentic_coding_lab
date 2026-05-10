export function nextGeneration(liveCells: Set<string>): Set<string> {
  const aliveSet = new Set(liveCells);
  const cellsToCheck = new Set<string>();

  // Add all live cells and their neighbors to check
  for (const coord of aliveSet) {
    const [x, y] = parseCoordinate(coord);
    cellsToCheck.add(coord);
    // Add all 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        cellsToCheck.add(`${x + dx},${y + dy}`);
      }
    }
  }

  // Also check neighbors of all currently alive cells (in case new cells are born at the edges)
  const neighbors = new Set<string>();
  for (const coord of aliveSet) {
    const [x, y] = parseCoordinate(coord);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        neighbors.add(`${x + dx},${y + dy}`);
      }
    }
  }
  neighbors.forEach((coord) => cellsToCheck.add(coord));

  const nextGen = new Set<string>();

  // Apply the rules to each cell that might change
  for (const coord of cellsToCheck) {
    const liveNeighbors = countLiveNeighbors(coord, aliveSet);
    const isAlive = aliveSet.has(coord);

    if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
      // Living cell with 2 or 3 neighbors survives
      nextGen.add(coord);
    } else if (!isAlive && liveNeighbors === 3) {
      // Dead cell with exactly 3 neighbors is born
      nextGen.add(coord);
    }
    // Otherwise cell is dead
  }

  return nextGen;
}

function parseCoordinate(coord: string): [number, number] {
  const [x, y] = coord.split(',').map(Number);
  return [x, y];
}

function countLiveNeighbors(coord: string, aliveSet: Set<string>): number {
  const [x, y] = parseCoordinate(coord);
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const neighborCoord = `${x + dx},${y + dy}`;
      if (aliveSet.has(neighborCoord)) {
        count++;
      }
    }
  }

  return count;
}
