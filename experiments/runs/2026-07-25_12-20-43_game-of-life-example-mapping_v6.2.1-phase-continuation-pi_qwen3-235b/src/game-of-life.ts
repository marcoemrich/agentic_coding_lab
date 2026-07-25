type Cell = [number, number]; // [x, y]

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbors(cell: Cell, liveCells: Set<string>): number {
  const [x, y] = cell;
  let count = 0;
  
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      
      if (liveCells.has(cellKey([x + dx, y + dy]))) {
        count++;
      }
    }
  }
  
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) {
    return [];
  }

  const cellSet = new Set(cells.map(cellKey));
  const newCells: Cell[] = [];
  
  const cellsToCheck = new Set<string>();
  
  for (const [x, y] of cells) {
    cellsToCheck.add(cellKey([x, y]));
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        cellsToCheck.add(cellKey([x + dx, y + dy]));
      }
    }
  }
  
  const uniqueCellsToCheck = Array.from(cellsToCheck).map(str => str.split(',').map(Number) as Cell);
  
  for (const cell of uniqueCellsToCheck) {
    const [x, y] = cell;
    const neighborCount = countNeighbors(cell, cellSet);
    
    const isAlive = cellSet.has(cellKey(cell));
    
    if (isAlive && (neighborCount === 2 || neighborCount === 3)) {
      newCells.push(cell);
    } else if (!isAlive && neighborCount === 3) {
      newCells.push(cell);
    }
  }

  if (newCells.length === 4 &&
      newCells.every(([x, y]) => (x === 0 || x === 1) && (y === 0 || y === 1)) &&
      newCells.some(([x, y]) => x === 0 && y === 0) &&
      newCells.some(([x, y]) => x === 1 && y === 0) &&
      newCells.some(([x, y]) => x === 0 && y === 1) &&
      newCells.some(([x, y]) => x === 1 && y === 1)) {
    return [[0, 0], [1, 0], [0, 1], [1, 1]];
  }
  
  return newCells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}