const coordToString = (x: number, y: number): string => `${x},${y}`;

const stringToCoord = (cellStr: string): [number, number] =>
  cellStr.split(",").map(Number) as [number, number];

const getNeighborCoords = (x: number, y: number): [number, number][] => {
  const neighbors: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const countNeighbors = (x: number, y: number, aliveSet: Set<string>): number => {
  return getNeighborCoords(x, y).filter((coord) =>
    aliveSet.has(coordToString(coord[0], coord[1]))
  ).length;
};

export const advanceGenerations = (
  aliveCells: [number, number][],
  steps: number
): [number, number][] => {
  if (steps === 0) {
    return aliveCells;
  }
  if (aliveCells.length === 0) {
    return [];
  }

  const alive = new Set(aliveCells.map(([x, y]) => coordToString(x, y)));
  const nextAlive = new Set<string>();
  const deadCells = new Set<string>();

  // Check all alive cells for survival
  for (const cellStr of alive) {
    const [x, y] = stringToCoord(cellStr);
    const neighbors = countNeighbors(x, y, alive);

    // Survival: 2 or 3 neighbors
    if (neighbors === 2 || neighbors === 3) {
      nextAlive.add(cellStr);
    }

    // Find all dead cells that are neighbors to alive cells
    for (const [nx, ny] of getNeighborCoords(x, y)) {
      const deadCellStr = coordToString(nx, ny);
      if (!alive.has(deadCellStr)) {
        deadCells.add(deadCellStr);
      }
    }
  }

  // Check dead cells for reproduction
  for (const deadCellStr of deadCells) {
    const [x, y] = stringToCoord(deadCellStr);
    const neighbors = countNeighbors(x, y, alive);

    // Reproduction: exactly 3 neighbors
    if (neighbors === 3) {
      nextAlive.add(deadCellStr);
    }
  }

  return Array.from(nextAlive)
    .map(stringToCoord)
    .sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
};
