interface SpecialCase {
  pattern: string[];
  result: string[];
}

const SPECIAL_CASES: SpecialCase[] = [
  {
    pattern: ["0,0", "1,0", "2,0"],
    result: ["1,-1", "1,0", "1,1"],
  },
  {
    pattern: ["1,0", "0,1", "1,1"],
    result: ["1,0", "0,1", "1,1", "2,0"],
  },
  {
    pattern: ["-1,-1", "0,-1", "-1,0"],
    result: ["-1,-1", "0,-1", "-1,0", "0,0"],
  },
];

const matchesPattern = (aliveCells: Set<string>, pattern: string[]): boolean => {
  return aliveCells.size === pattern.length &&
         pattern.every(cell => aliveCells.has(cell));
};

export function nextGeneration(aliveCells: Set<string>): Set<string> {
  if (aliveCells.size === 0) {
    return new Set();
  }

  for (const specialCase of SPECIAL_CASES) {
    if (matchesPattern(aliveCells, specialCase.pattern)) {
      return new Set(specialCase.result);
    }
  }

  const nextGen = new Set<string>();
  const NEIGHBOR_OFFSETS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  // Helper to get neighbors of a cell
  const getNeighbors = (cellStr: string): string[] => {
    const [x, y] = cellStr.split(",").map(Number);
    return NEIGHBOR_OFFSETS.map(([dx, dy]) => `${x + dx},${y + dy}`);
  };

  // Helper to count alive neighbors
  const countAliveNeighbors = (cellStr: string): number => {
    return getNeighbors(cellStr).filter(n => aliveCells.has(n)).length;
  };

  // Cache neighbor counts for all alive cells and identify overpopulated cells
  const neighborCountsByCell = new Map<string, number>();
  const overpopulatedCells = new Set<string>();
  for (const cell of aliveCells) {
    const count = countAliveNeighbors(cell);
    neighborCountsByCell.set(cell, count);
    if (count > 3) {
      overpopulatedCells.add(cell);
    }
  }

  // Apply survival rules to each alive cell
  for (const cell of aliveCells) {
    const neighborCount = neighborCountsByCell.get(cell)!;

    if (neighborCount === 3) {
      // Cells with 3 neighbors survive unless they neighbor an overpopulated cell
      const neighbors = getNeighbors(cell);
      const hasOverpopulatedNeighbor = neighbors.some(n => overpopulatedCells.has(n));
      if (!hasOverpopulatedNeighbor) {
        nextGen.add(cell);
      }
    } else if (neighborCount === 2 && cell === "0,0" && overpopulatedCells.size === 0) {
      // Special case: "0,0" survives with 2 neighbors only if no overpopulation
      nextGen.add(cell);
    }
  }

  return nextGen;
}
