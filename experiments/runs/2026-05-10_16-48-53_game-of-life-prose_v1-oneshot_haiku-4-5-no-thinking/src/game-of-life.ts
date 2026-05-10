/**
 * Represents a cell in the grid using coordinate format "x,y"
 */
type Cell = string;

/**
 * Converts coordinates to a cell string
 */
function coordsToCell(x: number, y: number): Cell {
  return `${x},${y}`;
}

/**
 * Parses a cell string back to coordinates
 */
function cellToCoords(cell: Cell): [number, number] {
  const [x, y] = cell.split(',').map(Number);
  return [x, y];
}

/**
 * Gets all 8 neighbors of a cell at (x, y)
 */
function getNeighbors(x: number, y: number): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        neighbors.push(coordsToCell(x + dx, y + dy));
      }
    }
  }
  return neighbors;
}

/**
 * Counts the number of live neighbors for a cell
 */
function countLiveNeighbors(x: number, y: number, liveCells: Set<Cell>): number {
  return getNeighbors(x, y).filter(neighbor => liveCells.has(neighbor)).length;
}

/**
 * Computes the next generation of the Game of Life
 * @param currentGen Set of living cells represented as "x,y" strings
 * @returns Set of living cells in the next generation
 */
export function nextGeneration(currentGen: Set<Cell>): Set<Cell> {
  const nextGen = new Set<Cell>();

  // We need to check:
  // 1. All currently living cells (they might die or survive)
  // 2. All neighbors of living cells (dead cells might resurrect)

  const cellsToCheck = new Set<Cell>();

  // Add all living cells
  for (const cell of currentGen) {
    cellsToCheck.add(cell);
  }

  // Add all neighbors of living cells (potential resurrections)
  for (const cell of currentGen) {
    const [x, y] = cellToCoords(cell);
    for (const neighbor of getNeighbors(x, y)) {
      cellsToCheck.add(neighbor);
    }
  }

  // Apply the rules to each cell we need to check
  for (const cell of cellsToCheck) {
    const [x, y] = cellToCoords(cell);
    const liveNeighbors = countLiveNeighbors(x, y, currentGen);
    const isAlive = currentGen.has(cell);

    if (isAlive) {
      // Survival rules: 2 or 3 live neighbors
      if (liveNeighbors === 2 || liveNeighbors === 3) {
        nextGen.add(cell);
      }
    } else {
      // Resurrection rule: exactly 3 live neighbors
      if (liveNeighbors === 3) {
        nextGen.add(cell);
      }
    }
  }

  return nextGen;
}
