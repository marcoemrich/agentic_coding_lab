export function nextGeneration(cells) {
  if (cells.length === 0) return [];

  // Get all unique coordinates to check (current live cells + their neighbors)
  const cellSet = new Set(cells.map(([x, y]) => `${x},${y}`));
  const candidates = new Set();

  // Add all neighbors of live cells as potential birth/death locations
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        candidates.add(`${x + dx},${y + dy}`);
      }
    }
    // Current live cell should also be considered for survival
    candidates.add(`${x},${y}`);
  }

  // Calculate next generation
  const next = [];
  for (const coord of candidates) {
    const [xStr, yStr] = coord.split(',').map(Number);
    
    // Count live neighbors
    let neighbors = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (cellSet.has(`${xStr + dx},${yStr + dy}`)) {
          neighbors++;
        }
      }
    }

    // Apply Game of Life rules
    const isAlive = cellSet.has(`${xStr},${yStr}`);
    if (isAlive && (neighbors === 2 || neighbors === 3)) {
      next.push([xStr, yStr]); // Survival
    } else if (!isAlive && neighbors === 3) {
      next.push([xStr, yStr]); // Reproduction
    }
    // Death by underpopulation/overpopulation is implicit (not added)
  }

  // Sort the results for consistent output
  next.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return next;
}