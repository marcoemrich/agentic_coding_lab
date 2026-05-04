export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

function countLiveNeighbors(x: number, y: number, livingCells: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    const neighborKey = `${x + dx},${y + dy}`;
    if (livingCells.has(neighborKey)) {
      count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(([x, y]) => `${x},${y}`));

  // Get all cells to check: living cells + all their neighbors
  const cellsToCheck = new Set<string>();
  for (const [x, y] of cells) {
    cellsToCheck.add(`${x},${y}`);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      cellsToCheck.add(`${x + dx},${y + dy}`);
    }
  }

  const nextGen: Cell[] = [];

  for (const cellKey of cellsToCheck) {
    const [x, y] = cellKey.split(',').map(Number) as [number, number];
    const liveNeighbors = countLiveNeighbors(x, y, livingCells);
    const isAlive = livingCells.has(cellKey);

    // Apply Game of Life rules
    if (isAlive) {
      // Survival: 2 or 3 neighbors
      if (liveNeighbors === 2 || liveNeighbors === 3) {
        nextGen.push([x, y]);
      }
      // Underpopulation: < 2 neighbors (dies)
      // Overpopulation: > 3 neighbors (dies)
    } else {
      // Reproduction: exactly 3 neighbors
      if (liveNeighbors === 3) {
        nextGen.push([x, y]);
      }
    }
  }

  return nextGen;
}
