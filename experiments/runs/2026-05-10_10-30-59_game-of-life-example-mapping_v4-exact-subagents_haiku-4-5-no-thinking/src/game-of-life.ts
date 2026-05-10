export type Coordinate = [number, number];

const parseCoordinate = (cellString: string): Coordinate => {
  const [x, y] = cellString.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: Coordinate[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

const formatCoordinate = (x: number, y: number): string => {
  return `${x},${y}`;
};

const getNeighborCells = (x: number, y: number): string[] => {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => formatCoordinate(x + dx, y + dy));
};

const countLiveNeighbors = (cell: string, livingCells: Set<string>): number => {
  const [x, y] = parseCoordinate(cell);
  return getNeighborCells(x, y).reduce((count, neighbor) =>
    livingCells.has(neighbor) ? count + 1 : count, 0
  );
};

const shouldCellSurviveOrBeBorn = (isAlive: boolean, liveNeighborCount: number): boolean => {
  if (isAlive && (liveNeighborCount === 2 || liveNeighborCount === 3)) {
    return true; // Cell survives with 2 or 3 neighbors
  }
  if (!isAlive && liveNeighborCount === 3) {
    return true; // Dead cell becomes alive with exactly 3 neighbors
  }
  return false;
};

/**
 * Computes the next generation of cells in Conway's Game of Life.
 *
 * Cells are represented as strings in the format "x,y" where x and y are integers.
 *
 * Rules applied:
 * - Cell with < 2 neighbors dies (underpopulation)
 * - Cell with 2-3 neighbors survives
 * - Cell with > 3 neighbors dies (overpopulation)
 * - Dead cell with exactly 3 neighbors becomes alive (reproduction)
 *
 * @param cells Set of living cells as coordinate strings "x,y"
 * @returns Set of living cells in the next generation
 */
export function nextGeneration(cells: Set<string>): Set<string> {
  const cellsToCheck = new Set<string>();

  // Add all living cells and their neighbors to check
  for (const cell of cells) {
    const [x, y] = parseCoordinate(cell);
    cellsToCheck.add(cell);
    for (const neighbor of getNeighborCells(x, y)) {
      cellsToCheck.add(neighbor);
    }
  }

  const nextGen = new Set<string>();

  // Check each cell and determine if it survives or is born
  for (const cell of cellsToCheck) {
    const isAlive = cells.has(cell);
    const liveNeighborCount = countLiveNeighbors(cell, cells);

    if (shouldCellSurviveOrBeBorn(isAlive, liveNeighborCount)) {
      nextGen.add(cell);
    }
  }

  return nextGen;
}
