function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: [number, number][]): [number, number][] {
  // Handle empty input
  if (cells.length === 0) return [];

  // Convert cell array to Set for O(1) lookup
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));
  
  // Get all neighbor positions for live cells
  const neighborCounts = new Map<string, number>();
  
  // Directions for the 8 possible neighbors (Moore neighborhood)
  const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  // Count neighbors for each position adjacent to live cells
  for (const [x, y] of cells) {
    for (const [dx, dy] of DIRECTIONS) {
      const neighbor: [number, number] = [x + dx, y + dy];
      const key = cellKey(neighbor[0], neighbor[1]);
      neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
    }
  }
  
  // Apply Game of Life rules
  const nextCells: [number, number][] = [];
  
  // Rule 1 & 2: Survival - live cells with exactly 2 or 3 neighbors survive
  for (const [x, y] of cells) {
    const key = cellKey(x, y);
    const count = neighborCounts.get(key) || 0;
    if (count === 2 || count === 3) {
      nextCells.push([x, y]);
    }
  }
  
  const REPRODUCTION_COUNT = 3;
  
  // Rule 4: Reproduction - dead cells with exactly REPRODUCTION_COUNT neighbors become alive
  for (const [key, count] of neighborCounts.entries()) {
    if (count === REPRODUCTION_COUNT && !liveCells.has(key)) {
      const coords = key.split(',').map(Number) as [number, number];
      const [x, y] = coords;
      nextCells.push([x, y]);
    }
  }
  
  // Sort the cells to ensure consistent output order
  // Sort by y first, then by x for consistent ordering
  return nextCells.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}