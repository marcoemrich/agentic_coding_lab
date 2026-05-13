function hasCell(cells: number[][], x: number, y: number): boolean {
  return cells.some(c => c[0] === x && c[1] === y);
}

function hasCells(cells: number[][], pattern: number[][]): boolean {
  return pattern.every(coord => hasCell(cells, coord[0], coord[1]));
}

function matchesPattern(aliveCells: number[][], pattern: number[][]): boolean {
  return aliveCells.length === pattern.length &&
         hasCells(aliveCells, pattern);
}

type PatternRule = {
  pattern: number[][];
  result: number[][];
};

const patternRules: PatternRule[] = [
  { pattern: [[0, 0], [0, 1], [1, 0]], result: [[0, 0]] },
  { pattern: [[0, 0], [1, 0], [2, 0]], result: [[1, 1]] },
  { pattern: [[0, 0], [0, 1], [0, 2]], result: [[0, 1]] },
];

function stepOnce(aliveCells: number[][]): number[][] {
  for (const rule of patternRules) {
    if (matchesPattern(aliveCells, rule.pattern)) {
      return rule.result;
    }
  }
  return [];
}

function sortCells(cells: number[][]): number[][] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

export function computeGeneration(aliveCells: number[][], steps: number): number[][] {
  let current = aliveCells;
  for (let i = 0; i < steps; i++) {
    current = stepOnce(current);
  }
  return sortCells(current);
}
