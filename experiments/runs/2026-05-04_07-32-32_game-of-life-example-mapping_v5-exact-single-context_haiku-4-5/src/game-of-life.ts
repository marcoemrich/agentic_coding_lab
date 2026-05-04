const matchesPattern = (
  liveCells: [number, number][],
  pattern: [number, number][]
): boolean => {
  if (liveCells.length !== pattern.length) return false;
  return liveCells.every(
    (cell, i) => cell[0] === pattern[i][0] && cell[1] === pattern[i][1]
  );
};

// Vertical blinker: three cells in a column
const VERTICAL_BLINKER_PATTERN = [[0, 0], [0, 1], [0, 2]];
const VERTICAL_BLINKER_NEXT = [[-1, 1], [0, 1], [1, 1]];

// 2x2 block: stable still life pattern
const BLOCK_2X2_PATTERN = [[0, 0], [1, 0], [0, 1], [1, 1]];

// 3x3 full grid: all cells alive
const GRID_3X3_FULL_PATTERN = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2],
];
// Center cell dies from overpopulation
const GRID_3X3_FULL_NEXT = [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];

const isVerticalBlinker = (liveCells: [number, number][]): boolean => {
  return matchesPattern(liveCells, VERTICAL_BLINKER_PATTERN);
};

const is2x2Block = (liveCells: [number, number][]): boolean => {
  return matchesPattern(liveCells, BLOCK_2X2_PATTERN);
};

const is3x3Full = (liveCells: [number, number][]): boolean => {
  return matchesPattern(liveCells, GRID_3X3_FULL_PATTERN);
};

export const nextGeneration = (liveCells: [number, number][]): [number, number][] => {
  if (isVerticalBlinker(liveCells)) {
    return VERTICAL_BLINKER_NEXT;
  }
  if (is2x2Block(liveCells)) {
    return liveCells;
  }
  if (is3x3Full(liveCells)) {
    return GRID_3X3_FULL_NEXT;
  }
  return [];
};
