export interface GameState {
  aliveCells: Array<[number, number]>;
}

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
] as const;

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): [number, number] {
  return key.split(",").map(Number) as [number, number];
}

function countLiveNeighbors(
  x: number,
  y: number,
  alive: Set<string>
): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (alive.has(cellKey(x + dx, y + dy))) count++;
  }
  return count;
}

function advanceOneGeneration(
  aliveCells: Array<[number, number]>
): Array<[number, number]> {
  if (aliveCells.length === 0) {
    return [];
  }

  // Create a set for O(1) lookup
  const alive = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));

  // Cells to check: all alive cells and their neighbors
  const cellsToCheck = new Set<string>();
  for (const [x, y] of aliveCells) {
    cellsToCheck.add(cellKey(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      cellsToCheck.add(cellKey(x + dx, y + dy));
    }
  }

  // Apply Game of Life rules
  const nextGeneration: Array<[number, number]> = [];
  for (const key of cellsToCheck) {
    const [x, y] = parseKey(key);
    const liveNeighbors = countLiveNeighbors(x, y, alive);
    const isAlive = alive.has(key);

    if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
      nextGeneration.push([x, y]);
    } else if (!isAlive && liveNeighbors === 3) {
      nextGeneration.push([x, y]);
    }
  }

  return nextGeneration;
}

export function advanceGenerations(
  aliveCells: Array<[number, number]>,
  steps: number
): Array<[number, number]> {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = advanceOneGeneration(current);
  }
  // Sort lexicographically: x ascending, then y ascending
  return current.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
