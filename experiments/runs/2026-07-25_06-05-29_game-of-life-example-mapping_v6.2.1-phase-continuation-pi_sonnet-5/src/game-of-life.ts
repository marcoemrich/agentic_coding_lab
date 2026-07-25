export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cellSet: Set<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const key of cellSet) {
    const [x, y] = parseCellKey(key);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighborKey = cellKey(x + dx, y + dy);
        counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
      }
    }
  }
  return counts;
}

// Conway's rules: a live cell survives with 2 or 3 live neighbors,
// and a dead cell is born with exactly 3 live neighbors.
function isAliveNextGeneration(isAlive: boolean, liveNeighborCount: number): boolean {
  if (isAlive) {
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  }
  return liveNeighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const cellSet = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cellSet);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (isAliveNextGeneration(cellSet.has(key), count)) {
      result.push(parseCellKey(key));
    }
  }
  return result;
}
