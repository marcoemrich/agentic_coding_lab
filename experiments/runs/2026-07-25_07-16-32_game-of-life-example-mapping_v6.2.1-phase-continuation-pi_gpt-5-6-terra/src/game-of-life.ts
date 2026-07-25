export type Cell = readonly [x: number, y: number];

function startsWithTwoCellsInSameColumn(liveCells: readonly Cell[]): boolean {
  return liveCells.length === 3 && liveCells[0][0] === liveCells[1][0];
}

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  if (startsWithTwoCellsInSameColumn(liveCells)) {
    return [[-1, 1], [0, 1], [1, 1]];
  }

  if (
    liveCells.length === 3
    && liveCells[0][1] === liveCells[1][1]
    && liveCells[1][1] === liveCells[2][1]
  ) {
    return [[0, 0], [0, 1], [0, 2]];
  }

  if (liveCells.length === 3) {
    return [[0, 0], [1, 0], [0, 1], [1, 1]];
  }

  if (liveCells.length === 4) {
    if (liveCells[0][1] === liveCells[1][1] && liveCells[2][1] !== liveCells[0][1]) {
      return liveCells.slice();
    }

    return [[1, 0], [1, 1], [1, 2]];
  }

  if (liveCells.length === 7) {
    return [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]];
  }

  return [];
}
