/**
 * Represents a cell coordinate as [x, y]
 */
type Cell = [number, number];

/**
 * Get all 8 neighbors of a cell
 */
function getNeighbors(cell: Cell): Cell[] {
  const [x, y] = cell;
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ] as Cell[];
}

/**
 * Count live neighbors of a cell
 */
function countLiveNeighbors(cell: Cell, liveCells: Set<string>): number {
  const neighbors = getNeighbors(cell);
  return neighbors.filter(neighbor => liveCells.has(cellToKey(neighbor))).length;
}

/**
 * Convert a cell coordinate to a string key for Set storage
 */
function cellToKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

/**
 * Convert a string key back to a cell coordinate
 */
function keyToCell(key: string): Cell {
  const [x, y] = key.split(',').map(Number);
  return [x, y];
}

/**
 * Get the next generation of cells based on Conway's Game of Life rules
 *
 * @param cells - Array of [x, y] coordinates of living cells
 * @returns Array of [x, y] coordinates of living cells in the next generation
 */
export function nextGeneration(cells: Array<[number, number]>): Array<[number, number]> {
  // Convert to Set for O(1) lookup
  const liveCells = new Set(cells.map(cellToKey));

  // Get all cells to check: living cells + all their neighbors
  const cellsToCheck = new Set<string>();

  liveCells.forEach(key => {
    const cell = keyToCell(key);
    cellsToCheck.add(key);
    getNeighbors(cell).forEach(neighbor => {
      cellsToCheck.add(cellToKey(neighbor));
    });
  });

  // Apply Game of Life rules
  const nextGen: Array<[number, number]> = [];

  cellsToCheck.forEach(key => {
    const cell = keyToCell(key);
    const liveNeighborCount = countLiveNeighbors(cell, liveCells);
    const isAlive = liveCells.has(key);

    // Apply the rules
    if (isAlive) {
      // Live cell: survives with 2 or 3 neighbors
      if (liveNeighborCount === 2 || liveNeighborCount === 3) {
        nextGen.push(cell);
      }
      // Otherwise dies (underpopulation or overpopulation)
    } else {
      // Dead cell: becomes alive with exactly 3 neighbors
      if (liveNeighborCount === 3) {
        nextGen.push(cell);
      }
    }
  });

  return nextGen;
}
