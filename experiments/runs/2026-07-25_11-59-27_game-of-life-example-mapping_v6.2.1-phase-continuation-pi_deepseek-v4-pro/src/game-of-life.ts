type Cell = [number, number];

function keyOf(x: number, y: number): string {
  return `${x},${y}`;
}

function coordOf(key: string): Cell {
  return key.split(",").map(Number) as Cell;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];
  
  const neighborCounts = new Map<string, number>();
  
  for (const [x, y] of cells) {
    // Increment count for each neighbor of this live cell
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = keyOf(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }
  
  const result: Cell[] = [];
  const liveSet = new Set(cells.map(([x, y]) => keyOf(x, y)));
  
  // Check all cells that have neighbors (potential next-gen cells)
  for (const [key, count] of neighborCounts) {
    const [x, y] = coordOf(key);
    
    if (count === 3 || (count === 2 && liveSet.has(key))) {
      result.push([x, y]);
    }
  }
  
  return result;
}