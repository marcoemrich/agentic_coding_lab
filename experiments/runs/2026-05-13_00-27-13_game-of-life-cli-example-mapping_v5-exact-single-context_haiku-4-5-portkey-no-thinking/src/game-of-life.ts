const getNeighborOffsets = (): [number, number][] => {
  const offsets: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      offsets.push([dx, dy]);
    }
  }
  return offsets;
};

const NEIGHBOR_OFFSETS = getNeighborOffsets();

const serializeCell = (x: number, y: number): string => `${x},${y}`;
const deserializeCell = (cellKey: string): [number, number] => {
  const [x, y] = cellKey.split(",").map(Number);
  return [x, y];
};

const countLiveNeighbors = (
  x: number,
  y: number,
  aliveCells: Set<string>
): number => {
  return NEIGHBOR_OFFSETS.reduce((count, [dx, dy]) => {
    return aliveCells.has(serializeCell(x + dx, y + dy)) ? count + 1 : count;
  }, 0);
};

const shouldCellSurvive = (isAlive: boolean, liveNeighbors: number): boolean => {
  // A cell survives if: (alive with 2-3 neighbors) OR (dead with exactly 3 neighbors)
  return (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) || (!isAlive && liveNeighbors === 3);
};

const compareCoordinates = ([x1, y1]: [number, number], [x2, y2]: [number, number]): number => {
  // Primary sort by x (ascending), secondary sort by y (ascending)
  return x1 !== x2 ? x1 - x2 : y1 - y2;
};

const addCellAndNeighbors = (cellKey: string, cellsToCheck: Set<string>): void => {
  // Add the cell itself and all its neighbors to the set for evaluation
  cellsToCheck.add(cellKey);
  const [x, y] = deserializeCell(cellKey);
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    cellsToCheck.add(serializeCell(x + dx, y + dy));
  }
};

export const advanceGenerations = (
  aliveCells: [number, number][],
  steps: number
): [number, number][] => {
  if (steps === 0) {
    return aliveCells;
  }

  let alive = new Set(aliveCells.map(([x, y]) => serializeCell(x, y)));

  for (let step = 0; step < steps; step++) {
    const cellsToCheck = new Set<string>();

    // Add all alive cells and their neighbors to check
    for (const cellKey of alive) {
      addCellAndNeighbors(cellKey, cellsToCheck);
    }

    const newAlive = new Set<string>();

    for (const cellKey of cellsToCheck) {
      const [x, y] = deserializeCell(cellKey);
      const neighbors = countLiveNeighbors(x, y, alive);
      const isAlive = alive.has(cellKey);

      if (shouldCellSurvive(isAlive, neighbors)) {
        newAlive.add(cellKey);
      }
    }

    alive = newAlive;
  }

  return Array.from(alive)
    .map(deserializeCell)
    .sort(compareCoordinates);
};
