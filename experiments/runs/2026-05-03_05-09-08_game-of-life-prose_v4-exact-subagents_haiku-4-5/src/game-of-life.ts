const NEIGHBOR_OFFSETS: [number, number][] = [
  [0, -1],  // up
  [0, 1],   // down
  [-1, 0],  // left
  [1, 0]    // right
];

function hasCell(x: number, y: number, grid: Set<[number, number]>): boolean {
  for (const [gx, gy] of grid) {
    if (gx === x && gy === y) {
      return true;
    }
  }
  return false;
}

function countNeighbors(x: number, y: number, grid: Set<[number, number]>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (hasCell(x + dx, y + dy, grid)) {
      count++;
    }
  }
  return count;
}

function getCellsToCheck(grid: Set<[number, number]>): Set<string> {
  const cellsToCheck = new Set<string>();
  const offsets = [[0, 0], ...NEIGHBOR_OFFSETS];
  for (const [x, y] of grid) {
    for (const [dx, dy] of offsets) {
      cellsToCheck.add(`${x + dx},${y + dy}`);
    }
  }
  return cellsToCheck;
}

export function nextGeneration(grid: Set<[number, number]>): Set<[number, number]> {
  if (grid.size === 0) {
    return new Set();
  }

  const result = new Set<[number, number]>();
  const cellsToCheck = getCellsToCheck(grid);

  for (const cellStr of cellsToCheck) {
    const [x, y] = cellStr.split(',').map(Number) as [number, number];
    const neighbors = countNeighbors(x, y, grid);
    const isAlive = hasCell(x, y, grid);

    if (isAlive && (neighbors === 2 || neighbors === 3)) {
      result.add([x, y]);
    } else if (!isAlive && neighbors === 3) {
      result.add([x, y]);
    }
  }

  return result;
}
