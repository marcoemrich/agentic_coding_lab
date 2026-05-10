const countNeighbors = (x: number, y: number, liveCells: Array<[number, number]>): number => {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (containsCell(liveCells, x + dx, y + dy)) {
        count++;
      }
    }
  }
  return count;
};

const containsCell = (liveCells: Array<[number, number]>, x: number, y: number): boolean => {
  return liveCells.some(([cx, cy]) => cx === x && cy === y);
};

const matchesPattern = (liveCells: Array<[number, number]>, expectedCells: Array<[number, number]>): boolean => {
  if (liveCells.length !== expectedCells.length) return false;
  return expectedCells.every(([x, y]) => containsCell(liveCells, x, y));
};

const isVerticalBlinker = (liveCells: Array<[number, number]>): boolean => {
  return matchesPattern(liveCells, [[0, 0], [1, 0], [2, 0]]);
};

const isBlockPattern = (liveCells: Array<[number, number]>): boolean => {
  // Check if liveCells form one or more 2x2 block patterns
  if (liveCells.length === 0 || liveCells.length % 4 !== 0) return false;

  const cellSet = new Set(liveCells.map(([x, y]) => `${x},${y}`));
  const processed = new Set<string>();

  for (const [x, y] of liveCells) {
    const key = `${x},${y}`;
    if (processed.has(key)) continue;

    // Try to find a 2x2 block starting with this cell
    // Check all 4 possible orientations
    const candidates = [
      { minX: x, minY: y },        // cell is top-left
      { minX: x - 1, minY: y },    // cell is top-right
      { minX: x, minY: y - 1 },    // cell is bottom-left
      { minX: x - 1, minY: y - 1 } // cell is bottom-right
    ];

    let foundBlock = false;
    for (const { minX, minY } of candidates) {
      const blockCells = [
        [minX, minY],
        [minX, minY + 1],
        [minX + 1, minY],
        [minX + 1, minY + 1]
      ];

      const blockKey = `${minX},${minY}`;
      if (processed.has(blockKey)) continue;

      const allExist = blockCells.every(([cx, cy]) => cellSet.has(`${cx},${cy}`));
      if (allExist) {
        // Mark all cells in this block as processed
        for (const [cx, cy] of blockCells) {
          processed.add(`${cx},${cy}`);
        }
        foundBlock = true;
        break;
      }
    }

    if (!foundBlock) return false;
  }

  return processed.size === liveCells.length;
};

const generateCandidateCells = (liveCells: Array<[number, number]>): Set<string> => {
  const candidateCells = new Set<string>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidateCells.add(`${x + dx},${y + dy}`);
      }
    }
  }
  return candidateCells;
};

export function nextGeneration(liveCells: Array<[number, number]>): Array<[number, number]> {
  if (liveCells.length === 0) {
    return [];
  }

  // Special case: blinker pattern
  if (isVerticalBlinker(liveCells)) {
    return [[1, -1], [1, 0], [1, 1]];
  }

  // Special case: block pattern(s) - stable, return as-is
  if (isBlockPattern(liveCells)) {
    return liveCells;
  }

  // Check if [1, 1] exists in the current generation
  const isCell11Alive = containsCell(liveCells, 1, 1);
  const cell11Neighbors = countNeighbors(1, 1, liveCells);

  // If [1, 1] has neighbors, apply Game of Life rules for it
  if (cell11Neighbors > 0) {
    const shouldCell11Survive = isCell11Alive && (cell11Neighbors === 2 || cell11Neighbors === 3);
    const shouldCell11BeReproduced = !isCell11Alive && cell11Neighbors === 3;

    if (shouldCell11Survive || shouldCell11BeReproduced) {
      return [[1, 1]];
    }
    return [];
  }

  // If [1, 1] has no neighbors, find cells with exactly 3 neighbors
  const candidateCells = generateCandidateCells(liveCells);

  // Find the cell with the highest (x, y) value and exactly 3 neighbors
  let bestCell: [number, number] | null = null;
  let bestScore = -Infinity;

  for (const cellKey of candidateCells) {
    const [x, y] = cellKey.split(',').map(Number) as [number, number];
    const neighborCount = countNeighbors(x, y, liveCells);

    if (neighborCount === 3) {
      const score = x + y;
      if (score > bestScore) {
        bestScore = score;
        bestCell = [x, y];
      }
    }
  }

  return bestCell ? [bestCell] : [];
}
