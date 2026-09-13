type Cell = [number, number]; // [x, y]

const keyOf = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => keyOf(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = keyOf(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, neighbors] of neighborCounts) {
    if (livesNextGeneration(neighbors, alive.has(key))) {
      const [x, y] = key.split(",").map(Number);
      nextCells.push([x, y]);
    }
  }

  return nextCells;
}

// Conway's rules distilled: a cell is alive next generation if it has exactly
// three neighbors (survival or reproduction) or has two neighbors and is
// already alive (survival). Fewer or more neighbors → death.
function livesNextGeneration(neighbors: number, isAlive: boolean): boolean {
  return neighbors === 3 || (neighbors === 2 && isAlive);
}
