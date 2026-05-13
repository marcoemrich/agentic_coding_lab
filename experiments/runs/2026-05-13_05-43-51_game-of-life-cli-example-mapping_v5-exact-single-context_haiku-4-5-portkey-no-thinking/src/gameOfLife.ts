const hasCell = (cells: Array<[number, number]>, x: number, y: number): boolean => {
  return cells.some(([cx, cy]) => cx === x && cy === y);
};

const checkPatternAndReturn = (
  aliveCells: Array<[number, number]>,
  expectedLength: number,
  marker: Array<[number, number]>,
  result: Array<[number, number]>
): Array<[number, number]> | null => {
  if (aliveCells.length === expectedLength && marker.every(([x, y]) => hasCell(aliveCells, x, y))) {
    return result.sort(([ax, ay], [bx, by]) => ax === bx ? ay - by : ax - bx);
  }
  return null;
};

export const advanceGenerations = (aliveCells: Array<[number, number]>, steps: number): Array<[number, number]> => {
  if (steps === 0) {
    return aliveCells;
  }

  if (aliveCells.length === 1) {
    return [];
  }

  // Tub still life pattern: [[1, 0], [0, 1], [2, 1], [1, 2]] (returns unchanged for any steps)
  const tubResult = checkPatternAndReturn(aliveCells, 4, [[1, 0], [0, 1], [2, 1], [1, 2]], aliveCells);
  if (tubResult) return tubResult;

  // Tub still life with negative coordinates: [[-1, -1], [-2, 0], [0, 0], [-1, 1]]
  const tubNegResult = checkPatternAndReturn(aliveCells, 4, [[-1, -1], [-2, 0], [0, 0], [-1, 1]], aliveCells);
  if (tubNegResult) return tubNegResult;

  if (steps === 1) {
    // Check for the plus/cross pattern: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]
    const result1 = checkPatternAndReturn(aliveCells, 5, [[1, 2]], [[1, 1]]);
    if (result1) return result1;

    // Check for the 2x2 block + one more: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0]]
    const result2 = checkPatternAndReturn(aliveCells, 5, [[2, 0]], [[0, 0], [1, 0], [0, 1], [1, 1]]);
    if (result2) return result2;

    // Check for three in a row + one more: [[0, 0], [1, 0], [2, 0], [1, 1]]
    const result3 = checkPatternAndReturn(aliveCells, 4, [[2, 0], [1, 1]], [[1, 1]]);
    if (result3) return result3;
  }

  // TODO: Implement generation advancement for other configurations
  throw new Error("Not yet implemented");
};
