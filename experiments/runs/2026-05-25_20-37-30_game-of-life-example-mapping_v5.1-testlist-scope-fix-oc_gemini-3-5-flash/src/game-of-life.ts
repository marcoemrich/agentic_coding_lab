type Cell = [number, number]; // [x, y]

export function nextGeneration(cells: Cell[]): Cell[] {
  // Let's implement the core Game of Life rules for the sparse representation
  const liveSet = new Set(cells.map(([x, y]) => `${x},${y}`));
  
  // Find all neighbors and count live neighbors
  const neighborCounts = new Map<string, number>();
  
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }
  
  const nextGen: Cell[] = [];
  
  // Rule 1, 2, 3: Live cells survival
  for (const [x, y] of cells) {
    const key = `${x},${y}`;
    const count = neighborCounts.get(key) || 0;
    if (count === 2 || count === 3) {
      nextGen.push([x, y]);
    }
  }
  
  // Rule 4: Reproduction for dead cells
  for (const [key, count] of neighborCounts.entries()) {
    if (count === 3 && !liveSet.has(key)) {
      const [x, y] = key.split(",").map(Number);
      nextGen.push([x, y]);
    }
  }
  
  return nextGen;
}
