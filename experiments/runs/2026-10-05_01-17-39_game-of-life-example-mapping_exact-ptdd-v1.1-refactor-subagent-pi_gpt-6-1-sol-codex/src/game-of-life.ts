export type Cell = [number, number];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(',').map(Number);
  return [x, y];
}

function survives(liveNeighbors: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return liveNeighbors === minimumSurvivalNeighbors || liveNeighbors === maximumSurvivalNeighbors;
}

function isBorn(liveNeighbors: number): boolean {
  const reproductionNeighbors = 3;
  return liveNeighbors === reproductionNeighbors;
}

function isAliveNextGeneration(isAlive: boolean, liveNeighbors: number): boolean {
  return isAlive ? survives(liveNeighbors) : isBorn(liveNeighbors);
}

function neighboringCells([x, y]: Cell): Cell[] {
  const offsets: Cell[] = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1],
    [0, 1], [1, -1], [1, 0], [1, 1],
  ];
  return offsets.map(([dx, dy]) => [x + dx, y + dy]);
}

function countLiveNeighbors(living: Set<string>): Map<string, number> {
  const neighbors = new Map<string, number>();
  for (const key of living) {
    for (const cell of neighboringCells(cellFromKey(key))) {
      const neighbor = cellKey(cell);
      neighbors.set(neighbor, (neighbors.get(neighbor) ?? 0) + 1);
    }
  }
  return neighbors;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const neighbors = countLiveNeighbors(living);
  const next: Cell[] = [];
  for (const [key, count] of neighbors) {
    if (isAliveNextGeneration(living.has(key), count)) {
      next.push(cellFromKey(key));
    }
  }
  return next;
}
