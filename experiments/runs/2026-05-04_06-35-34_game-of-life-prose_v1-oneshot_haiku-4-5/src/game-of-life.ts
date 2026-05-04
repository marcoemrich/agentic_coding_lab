export function nextGeneration(aliveCells: Set<string>): Set<string> {
  const nextAlive = new Set<string>();

  // Get all cells to check: living cells and their neighbors
  const cellsToCheck = new Set<string>();

  // Add all living cells and their neighbors to cells to check
  for (const cell of aliveCells) {
    cellsToCheck.add(cell);
    for (const neighbor of getNeighbors(cell)) {
      cellsToCheck.add(neighbor);
    }
  }

  // Apply rules to each cell
  for (const cell of cellsToCheck) {
    const liveNeighborCount = countLiveNeighbors(cell, aliveCells);
    const isAlive = aliveCells.has(cell);

    if (isAlive) {
      // Living cell with 2-3 neighbors survives
      if (liveNeighborCount === 2 || liveNeighborCount === 3) {
        nextAlive.add(cell);
      }
      // Otherwise dies (underpopulation or overpopulation)
    } else {
      // Dead cell with exactly 3 neighbors becomes alive
      if (liveNeighborCount === 3) {
        nextAlive.add(cell);
      }
    }
  }

  return nextAlive;
}

function parseCell(cell: string): [number, number] {
  const [x, y] = cell.split(',').map(Number);
  return [x, y];
}

function cellToString(x: number, y: number): string {
  return `${x},${y}`;
}

function getNeighbors(cell: string): string[] {
  const [x, y] = parseCell(cell);
  const neighbors: string[] = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself
      neighbors.push(cellToString(x + dx, y + dy));
    }
  }

  return neighbors;
}

function countLiveNeighbors(cell: string, aliveCells: Set<string>): number {
  let count = 0;

  const [x, y] = parseCell(cell);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself
      const neighbor = cellToString(x + dx, y + dy);
      if (aliveCells.has(neighbor)) {
        count++;
      }
    }
  }

  return count;
}
