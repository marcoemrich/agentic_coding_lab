/**
 * Represents a cell as a string in format "x,y"
 */
type Cell = string;

/**
 * Converts x, y coordinates to a cell string
 */
function cellKey(x: number, y: number): Cell {
  return `${x},${y}`;
}

/**
 * Parses a cell string to [x, y] coordinates
 */
function parseCell(cell: Cell): [number, number] {
  const [x, y] = cell.split(',').map(Number);
  return [x, y];
}

/**
 * Gets all 8 neighbors of a cell
 */
function getNeighbors(x: number, y: number): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push(cellKey(x + dx, y + dy));
    }
  }
  return neighbors;
}

/**
 * Counts the number of live neighbors for a cell
 */
function countLiveNeighbors(x: number, y: number, liveCells: Set<Cell>): number {
  return getNeighbors(x, y).filter(cell => liveCells.has(cell)).length;
}

/**
 * Computes the next generation of Conway's Game of Life
 *
 * @param cells - Set of living cells represented as "x,y" strings
 * @returns Set of living cells in the next generation
 */
export function nextGeneration(cells: Set<Cell>): Set<Cell> {
  const nextGen = new Set<Cell>();

  // Set to track all cells that need to be checked
  // (living cells and their dead neighbors)
  const cellsToCheck = new Set<Cell>();

  // Add all living cells to check
  cells.forEach(cell => cellsToCheck.add(cell));

  // Add all dead neighbors of living cells to check
  cells.forEach(cell => {
    const [x, y] = parseCell(cell);
    getNeighbors(x, y).forEach(neighbor => cellsToCheck.add(neighbor));
  });

  // Apply the rules to each cell
  cellsToCheck.forEach(cell => {
    const [x, y] = parseCell(cell);
    const liveNeighbors = countLiveNeighbors(x, y, cells);
    const isAlive = cells.has(cell);

    if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
      // Living cell with 2 or 3 neighbors survives
      nextGen.add(cell);
    } else if (!isAlive && liveNeighbors === 3) {
      // Dead cell with exactly 3 neighbors becomes alive
      nextGen.add(cell);
    }
    // All other cells die or remain dead
  });

  return nextGen;
}
