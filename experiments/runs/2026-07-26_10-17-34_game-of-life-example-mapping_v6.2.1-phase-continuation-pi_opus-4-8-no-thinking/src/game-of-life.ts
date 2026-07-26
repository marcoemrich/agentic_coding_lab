type Cell = [number, number]; // [x, y]

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function neighbors(x: number, y: number): Cell[] {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
}

function isAliveNextGeneration(isCurrentlyAlive: boolean, liveNeighbors: number): boolean {
  const NEIGHBORS_FOR_BIRTH = 3;
  const NEIGHBORS_FOR_SURVIVAL = 2;
  // Birth: a dead cell with exactly 3 live neighbors becomes alive.
  // Survival: a live cell with 2 or 3 live neighbors stays alive.
  return (
    liveNeighbors === NEIGHBORS_FOR_BIRTH ||
    (isCurrentlyAlive && liveNeighbors === NEIGHBORS_FOR_SURVIVAL)
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => key(x, y)));

  const neighborCounts = new Map<string, { count: number; cell: Cell }>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const k = key(nx, ny);
      const entry = neighborCounts.get(k) ?? { count: 0, cell: [nx, ny] };
      entry.count++;
      neighborCounts.set(k, entry);
    }
  }

  const result: Cell[] = [];
  for (const [k, { count, cell }] of neighborCounts) {
    if (isAliveNextGeneration(liveCells.has(k), count)) {
      result.push(cell);
    }
  }
  return result;
}
