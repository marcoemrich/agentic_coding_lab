type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
};

const isAliveNextGeneration = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isCurrentlyAlive && liveNeighborCount === 2);

export function nextGeneration(grid: Cell[]): Cell[] {
  const liveSet = new Set(grid.map(toKey));
  const candidates = new Map<string, Cell>();

  for (const cell of grid) {
    candidates.set(toKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(toKey(neighbor), neighbor);
    }
  }

  const result: Cell[] = [];
  for (const cell of candidates.values()) {
    const isCurrentlyAlive = liveSet.has(toKey(cell));
    const liveNeighborCount = neighborsOf(cell).filter((n) =>
      liveSet.has(toKey(n))
    ).length;
    if (isAliveNextGeneration(isCurrentlyAlive, liveNeighborCount)) {
      result.push(cell);
    }
  }

  return result;
}
