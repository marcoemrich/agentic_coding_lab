export type Cell = [number, number];

function containsCell(cells: Cell[], [targetX, targetY]: Cell): boolean {
  return cells.some(([x, y]) => x === targetX && y === targetY);
}

function countLiveNeighbors([x, y]: Cell, liveCells: Cell[]): number {
  return liveCells.filter(([neighborX, neighborY]) =>
    (neighborX !== x || neighborY !== y) &&
    Math.abs(neighborX - x) <= 1 &&
    Math.abs(neighborY - y) <= 1,
  ).length;
}

const minimumSurvivalNeighbors = 2;
const maximumSurvivalNeighbors = 3;
const reproductionNeighbors = 3;

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(cell, liveCells);
    return liveNeighborCount >= minimumSurvivalNeighbors &&
      liveNeighborCount <= maximumSurvivalNeighbors;
  });
  const birthCandidates = liveCells.flatMap(([x, y]) =>
    neighborOffsets.map(([offsetX, offsetY]): Cell => [x + offsetX, y + offsetY]),
  );
  const births = birthCandidates.filter((candidate, index) =>
    !containsCell(liveCells, candidate) &&
    birthCandidates.findIndex((cell) => containsCell([cell], candidate)) === index &&
    countLiveNeighbors(candidate, liveCells) === reproductionNeighbors,
  );

  return [...survivors, ...births];
}
