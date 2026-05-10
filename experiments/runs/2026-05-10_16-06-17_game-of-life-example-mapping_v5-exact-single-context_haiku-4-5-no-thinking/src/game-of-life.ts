export const nextGeneration = (cells: Array<[number, number]>): Array<[number, number]> => {
  const serializeCoord = (x: number, y: number): string => `${x},${y}`;
  const deserializeCoord = (key: string): [number, number] => {
    const [x, y] = key.split(',').map(Number) as [number, number];
    return [x, y];
  };

  const cellSet = new Set(cells.map(c => serializeCoord(c[0], c[1])));

  const getNeighborCoords = (x: number, y: number): Array<[number, number]> => {
    const neighbors: Array<[number, number]> = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        neighbors.push([x + dx, y + dy]);
      }
    }
    return neighbors;
  };

  const countNeighbors = (x: number, y: number): number => {
    let count = 0;
    for (const [nx, ny] of getNeighborCoords(x, y)) {
      if (cellSet.has(serializeCoord(nx, ny))) count++;
    }
    return count;
  };

  const result: Array<[number, number]> = [];

  for (const [x, y] of cells) {
    const neighbors = countNeighbors(x, y);
    // Survival: 2 or 3 neighbors (die if underpopulated or overpopulated)
    if (neighbors >= 2 && neighbors <= 3) {
      result.push([x, y]);
    }
  }

  // Check for reproduction - dead cells with exactly 3 neighbors
  const deadCellsToCheck = new Set<string>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of getNeighborCoords(x, y)) {
      const key = serializeCoord(nx, ny);
      if (!cellSet.has(key)) {
        deadCellsToCheck.add(key);
      }
    }
  }

  for (const key of deadCellsToCheck) {
    const [x, y] = deserializeCoord(key);
    const neighbors = countNeighbors(x, y);
    if (neighbors === 3) {
      result.push([x, y]);
    }
  }

  return result;
};
