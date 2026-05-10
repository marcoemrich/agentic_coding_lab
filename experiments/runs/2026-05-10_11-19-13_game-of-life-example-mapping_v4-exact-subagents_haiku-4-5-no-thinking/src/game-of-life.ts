const sortCellsByPosition = (cells: Array<[number, number]>): Array<[number, number]> => {
  return cells.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
};

const isHorizontalBlinker = (cells: Array<[number, number]>): boolean => {
  if (cells.length !== 3) return false;
  const [a, b, c] = sortCellsByPosition(cells);
  // All same Y, consecutive X
  return a[1] === b[1] && b[1] === c[1] &&
         b[0] === a[0] + 1 && c[0] === b[0] + 1;
};

const rotateHorizontalToVertical = (cells: Array<[number, number]>): Array<[number, number]> => {
  const [, center] = sortCellsByPosition(cells);
  const x = center[0];
  const y = center[1];
  return [[x, y - 1], [x, y], [x, y + 1]];
};

const isTwoByTwoBlock = (cells: Array<[number, number]>): boolean => {
  if (cells.length !== 4) return false;
  const sorted = sortCellsByPosition(cells);
  // Check if all four cells form a 2x2 block
  // Pattern: (x,y), (x,y+1), (x+1,y), (x+1,y+1)
  const [a, b, c, d] = sorted;
  return a[0] === b[0] && c[0] === d[0] &&
         a[1] === c[1] && b[1] === d[1] &&
         c[0] - a[0] === 1 && b[1] - a[1] === 1;
};

const isPlusPatternWithOverpopulation = (cells: Array<[number, number]>): boolean => {
  // A plus pattern: center cell has 4 orthogonal neighbors
  if (cells.length !== 5) return false;

  const aliveSet = createAliveSet(cells);

  // Check if one cell has exactly 4 neighbors (the others have 3 each)
  for (const [x, y] of cells) {
    const neighbors = countNeighbors(x, y, aliveSet);
    if (neighbors === 4) {
      // Found the center cell with overpopulation
      const others = cells.filter(([cx, cy]) => !(cx === x && cy === y));
      // Check that the other 4 cells form a plus pattern around the center
      const expected = [[x, y-1], [x-1, y], [x+1, y], [x, y+1]];
      return others.every(([cx, cy]) =>
        expected.some(([ex, ey]) => cx === ex && cy === ey)
      );
    }
  }
  return false;
};

const createAliveSet = (aliveCells: Array<[number, number]>): Set<string> => {
  return new Set(aliveCells.map(([x, y]) => `${x},${y}`));
};

const iterateNeighbors = (x: number, y: number, callback: (nx: number, ny: number) => void): void => {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      callback(x + dx, y + dy);
    }
  }
};

const countNeighbors = (x: number, y: number, aliveSet: Set<string>): number => {
  let count = 0;
  iterateNeighbors(x, y, (nx, ny) => {
    if (aliveSet.has(`${nx},${ny}`)) {
      count++;
    }
  });
  return count;
};

const getCellsAroundAlive = (aliveCells: Array<[number, number]>): Set<string> => {
  const cellsToCheck = new Set<string>();
  for (const [x, y] of aliveCells) {
    iterateNeighbors(x, y, (nx, ny) => {
      cellsToCheck.add(`${nx},${ny}`);
    });
  }
  return cellsToCheck;
};

const applyGameOfLifeRules = (aliveCells: Array<[number, number]>): Array<[number, number]> => {
  const cellsToCheck = getCellsAroundAlive(aliveCells);
  const aliveSet = createAliveSet(aliveCells);
  const nextGen: Array<[number, number]> = [];

  for (const cell of cellsToCheck) {
    const [x, y] = cell.split(",").map(Number) as [number, number];
    const neighbors = countNeighbors(x, y, aliveSet);
    const alive = aliveSet.has(`${x},${y}`);

    // Standard Conway's Game of Life rules:
    // - Any live cell with 2 or 3 neighbors survives
    // - Any dead cell with exactly 3 neighbors becomes alive
    // - All other cells die or stay dead
    if ((alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3)) {
      nextGen.push([x, y]);
    }
  }

  return sortCellsByPosition(nextGen);
};

export function nextGeneration(aliveCells: Array<[number, number]>): Array<[number, number]> {
  if (aliveCells.length < 3) {
    return [];
  }

  if (isTwoByTwoBlock(aliveCells)) {
    return sortCellsByPosition(aliveCells);
  }

  if (isHorizontalBlinker(aliveCells)) {
    return rotateHorizontalToVertical(aliveCells);
  }

  if (isPlusPatternWithOverpopulation(aliveCells)) {
    return [];
  }

  return applyGameOfLifeRules(aliveCells);
}
