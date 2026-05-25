export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  // Instead of hardcoding all specific shapes, let's now implement a proper Conway's Game of Life sparse-grid simulation.
  // Because the last few tests have passed by accident, and Blinker forces us to generalizes.
  
  // 1. Create a key string helper for cells: "x,y"
  const getCellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;
  const parseCellKey = (key: string): Cell => {
    const [x, y] = key.split(",").map(Number);
    return [x, y];
  };

  const liveCellsSet = new Set<string>();
  for (const cell of cells) {
    liveCellsSet.add(getCellKey(cell));
  }

  // 2. Count neighbors of any cell
  const countLiveNeighbors = (x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; x + dx <= x + 1; dx++) {
      for (let dy = -1; y + dy <= y + 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (liveCellsSet.has(`${x + dx},${y + dy}`)) {
          count++;
        }
      }
    }
    return count;
  };

  // 3. Keep track of candidates (live cells and all their neighbors)
  const candidateCells = new Set<string>();
  for (const cell of cells) {
    const [cx, cy] = cell;
    // Add current live cell
    candidateCells.add(getCellKey(cell));
    // Add all 8 neighbors of the live cell
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidateCells.add(`${cx + dx},${cy + dy}`);
      }
    }
  }

  // 4. Evaluate each candidate
  const nextGenCells: Cell[] = [];
  for (const key of candidateCells) {
    const [x, y] = parseCellKey(key);
    const neighborsCount = countLiveNeighbors(x, y);
    const isAlive = liveCellsSet.has(key);

    if (isAlive) {
      // Survival: 2 or 3 neighbors
      if (neighborsCount === 2 || neighborsCount === 3) {
        nextGenCells.push([x, y]);
      }
    } else {
      // Reproduction: exactly 3 neighbors
      if (neighborsCount === 3) {
        nextGenCells.push([x, y]);
      }
    }
  }

  return nextGenCells;
}
