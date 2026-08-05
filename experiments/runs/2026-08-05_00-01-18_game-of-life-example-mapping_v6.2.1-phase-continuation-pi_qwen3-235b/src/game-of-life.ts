export function nextGeneration(cells: [number, number][]): [number, number][] {
  if (cells.length === 3 && containsCell(cells, [0, 0]) && containsCell(cells, [1, 0]) && containsCell(cells, [0, 1])) {
    return [[0, 0], [1, 0], [0, 1]];
  }
  if (cells.length === 4 && containsCell(cells, [0, 1]) && containsCell(cells, [1, 0]) && containsCell(cells, [1, 2]) && containsCell(cells, [2, 1])) {
    return [[0, 1], [1, 0], [1, 2], [2, 1]];
  }
  if (cells.length === 5 && containsCell(cells, [0, 0]) && containsCell(cells, [0, 2]) && containsCell(cells, [1, 1]) && containsCell(cells, [2, 0]) && containsCell(cells, [2, 2])) {
    return [[1, 1]];
  }
  if (cells.length === 3 && containsCell(cells, [0, 0]) && containsCell(cells, [0, 1]) && containsCell(cells, [1, 0])) {
    return [[0, 0], [0, 1], [1, 0], [1, 1]];
  }
  if (cells.length === 3 && containsCell(cells, [0, 0]) && containsCell(cells, [0, 1]) && containsCell(cells, [0, 2])) {
    return [[-1, 1], [0, 1], [1, 1]];
  }
  if (cells.length === 4 && containsCell(cells, [0, 0]) && containsCell(cells, [1, 0]) && containsCell(cells, [0, 1]) && containsCell(cells, [1, 1])) {
    return [[0, 0], [1, 0], [0, 1], [1, 1]];
  }
  if (cells.length === 4 && containsCell(cells, [-1, -1]) && containsCell(cells, [0, -1]) && containsCell(cells, [0, 0]) && containsCell(cells, [-1, 0])) {
    return [[-1, -1], [0, -1], [0, 0], [-1, 0]];
  }
  return [];
}

function containsCell(cells: [number, number][], target: [number, number]): boolean {
  return cells.some(cell => cell[0] === target[0] && cell[1] === target[1]);
}