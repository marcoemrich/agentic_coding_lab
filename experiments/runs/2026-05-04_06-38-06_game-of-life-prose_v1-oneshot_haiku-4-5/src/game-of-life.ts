export function nextGeneration(living: Set<string>): Set<string> {
  const result = new Set<string>();

  // Parse coordinates
  const parseCoord = (cell: string): [number, number] => {
    const [x, y] = cell.split(',').map(Number);
    return [x, y];
  };

  // Format coordinates back to string
  const formatCoord = (x: number, y: number): string => `${x},${y}`;

  // Count live neighbors for a given cell
  const countLiveNeighbors = (x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (living.has(formatCoord(x + dx, y + dy))) {
          count++;
        }
      }
    }
    return count;
  };

  // Get all cells to check: living cells and their neighbors
  const cellsToCheck = new Set<string>();

  for (const cell of living) {
    const [x, y] = parseCoord(cell);
    cellsToCheck.add(cell);

    // Add all neighbors of living cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        cellsToCheck.add(formatCoord(x + dx, y + dy));
      }
    }
  }

  // Apply rules
  for (const cell of cellsToCheck) {
    const [x, y] = parseCoord(cell);
    const liveNeighbors = countLiveNeighbors(x, y);
    const isAlive = living.has(cell);

    if (isAlive) {
      // Living cell survives with 2 or 3 neighbors
      if (liveNeighbors === 2 || liveNeighbors === 3) {
        result.add(cell);
      }
    } else {
      // Dead cell becomes alive with exactly 3 neighbors
      if (liveNeighbors === 3) {
        result.add(cell);
      }
    }
  }

  return result;
}
