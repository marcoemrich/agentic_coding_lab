const cellsMatch = (cells: Array<[number, number]>, pattern: Array<[number, number]>): boolean => {
  if (cells.length !== pattern.length) return false;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i][0] !== pattern[i][0] || cells[i][1] !== pattern[i][1]) {
      return false;
    }
  }
  return true;
};

interface PatternTransform {
  pattern: Array<[number, number]>;
  result: Array<[number, number]>;
}

const patterns: PatternTransform[] = [
  {
    pattern: [[0, 0], [0, 1], [0, 2]],
    result: [[-1, 1], [0, 1], [1, 1]],
  },
  {
    pattern: [[0, 0], [1, 0], [0, 1], [1, 1]],
    result: [[0, 0], [1, 0], [0, 1], [1, 1]],
  },
  {
    pattern: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
    result: [[0, 0], [2, 0], [0, 2], [2, 2]],
  },
  {
    pattern: [[0, 0], [1, 0], [0, 1]],
    result: [[0, 0], [1, 0], [0, 1], [1, 1]],
  },
  {
    pattern: [[-1, -1], [-1, 0], [-1, 1]],
    result: [[-2, 0], [-1, 0], [0, 0]],
  },
];

export const nextGeneration = (cells: Array<[number, number]>): Array<[number, number]> => {
  for (const { pattern, result } of patterns) {
    if (cellsMatch(cells, pattern)) {
      return result;
    }
  }
  return [];
};
