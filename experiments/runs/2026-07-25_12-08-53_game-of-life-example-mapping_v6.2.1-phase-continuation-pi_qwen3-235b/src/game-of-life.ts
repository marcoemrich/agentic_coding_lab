type Cell = [number, number]; // [x, y]

export function nextGeneration(cells: Cell[]): Cell[] {
  // Convert to Set for O(1) lookup
  const liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  
  // Get all coordinates that need to be evaluated (live cells and their neighbors)
  const coordinatesToEvaluate = new Set<string>();
  
  // Add all live cells and their neighbors for evaluation
  for (const [x, y] of cells) {
    // Add the cell itself
    coordinatesToEvaluate.add(`${x},${y}`);
    
    // Add all 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        coordinatesToEvaluate.add(`${x + dx},${y + dy}`);
      }
    }
  }
  
  // Determine next generation
  const nextGen: Cell[] = [];
  
  for (const coord of coordinatesToEvaluate) {
    const [xStr, yStr] = coord.split(',');
    const x = parseInt(xStr, 10), y = parseInt(yStr, 10);
    
    // Count live neighbors
    let liveNeighbors = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (liveCells.has(`${x + dx},${y + dy}`)) {
          liveNeighbors++;
        }
      }
    }
    
    // Apply Conway's Game of Life rules
    const currentCell = `${x},${y}`;
    const isCurrentlyAlive = liveCells.has(currentCell);
    
    // Rule 2: Survival - live cell with 2 or 3 neighbors lives
    if (isCurrentlyAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
      nextGen.push([x, y]);
    }
    // Rule 4: Reproduction - dead cell with exactly 3 neighbors becomes alive
    else if (!isCurrentlyAlive && liveNeighbors === 3) {
      nextGen.push([x, y]);
    }
    // Note: All other cases (underpopulation, overpopulation, no reproduction) result in dead cell, so no action needed
  }
  
  // Sort the output to ensure consistent ordering for testing
  return nextGen.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
}
