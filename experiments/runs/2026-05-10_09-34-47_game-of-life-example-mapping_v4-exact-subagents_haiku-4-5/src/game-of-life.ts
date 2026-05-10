const NEIGHBOR_OFFSETS: Array<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// Helper to serialize cell coordinates to string for Set storage
const serializeCell = (x: number, y: number): string => `${x},${y}`;

// Helper to parse serialized cell coordinates back to tuple
const parseCell = (serialized: string): [number, number] => {
  return serialized.split(',').map(Number) as [number, number];
};

export function nextGeneration(grid: Array<[number, number]>): Array<[number, number]> {
  // Create a set for O(1) cell lookup instead of O(N) array search
  const gridSet = new Set(grid.map(([x, y]) => serializeCell(x, y)));

  // Helper to check if a cell exists at coordinates
  const cellExists = (x: number, y: number): boolean => {
    return gridSet.has(serializeCell(x, y));
  };

  // Count neighbors for each cell
  const countNeighbors = (x: number, y: number): number => {
    return NEIGHBOR_OFFSETS.filter(([dx, dy]) => cellExists(x + dx, y + dy)).length;
  };

  // Collect all dead cells adjacent to live cells
  const collectDeadCellsAdjacentToLiveCells = (): Set<string> => {
    const deadCells = new Set<string>();
    for (const [x, y] of grid) {
      for (const [dx, dy] of NEIGHBOR_OFFSETS) {
        const neighbor = serializeCell(x + dx, y + dy);
        if (!gridSet.has(neighbor)) {
          deadCells.add(neighbor);
        }
      }
    }
    return deadCells;
  };

  // Rule 1 & 3: Live cells survive with 2-3 neighbors
  const survivingCells = grid.filter(([x, y]) => {
    const neighbors = countNeighbors(x, y);
    return neighbors >= 2 && neighbors <= 3;
  });

  // Rule 4: Dead cells with exactly 3 neighbors become alive
  const deadCellsSet = collectDeadCellsAdjacentToLiveCells();
  const newCells: Array<[number, number]> = [];
  for (const cell of deadCellsSet) {
    const [x, y] = parseCell(cell);
    if (countNeighbors(x, y) === 3) {
      newCells.push([x, y]);
    }
  }

  // Combine surviving cells and new cells
  const result = [...survivingCells, ...newCells];
  return result;
}
