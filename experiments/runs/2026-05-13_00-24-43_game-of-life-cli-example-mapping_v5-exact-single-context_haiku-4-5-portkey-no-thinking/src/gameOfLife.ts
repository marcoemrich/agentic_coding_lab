const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const encodeCoord = (x: number, y: number): string => `${x},${y}`;
const decodeCoord = (str: string): [number, number] => {
  const [x, y] = str.split(",").map(Number);
  return [x, y];
};

const countNeighbors = (x: number, y: number, aliveCells: Set<string>): number => {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (aliveCells.has(encodeCoord(x + dx, y + dy))) {
      count++;
    }
  }
  return count;
};

const advanceOneGeneration = (aliveCells: number[][]): number[][] => {
  const aliveSet = new Set(aliveCells.map(([x, y]) => encodeCoord(x, y)));
  const cellsToCheck = new Set<string>();

  // Add all alive cells and their neighbors to check
  for (const [x, y] of aliveCells) {
    cellsToCheck.add(encodeCoord(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      cellsToCheck.add(encodeCoord(x + dx, y + dy));
    }
  }

  const nextGeneration: number[][] = [];
  for (const cellStr of cellsToCheck) {
    const [x, y] = decodeCoord(cellStr);
    const neighbors = countNeighbors(x, y, aliveSet);
    const isAlive = aliveSet.has(cellStr);

    // Apply Game of Life rules
    if (isAlive && (neighbors === 2 || neighbors === 3)) {
      nextGeneration.push([x, y]);
    } else if (!isAlive && neighbors === 3) {
      nextGeneration.push([x, y]);
    }
  }

  // Sort lexicographically: x ascending (primary), y ascending (secondary)
  nextGeneration.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  return nextGeneration;
};

export const advanceGenerations = (aliveCells: number[][], steps: number): number[][] => {
  if (steps === 0) {
    return aliveCells;
  }
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = advanceOneGeneration(current);
  }
  return current;
};
