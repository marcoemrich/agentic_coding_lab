const cellKey = (cell: number[]): string => `${cell[0]},${cell[1]}`;

const isNeighbor = (cell: number[], other: number[]): boolean =>
  !(other[0] === cell[0] && other[1] === cell[1]) &&
  Math.abs(other[0] - cell[0]) <= 1 &&
  Math.abs(other[1] - cell[1]) <= 1;

const countLiveNeighbors = (cell: number[], liveCells: number[][]): number =>
  liveCells.filter((other) => isNeighbor(cell, other)).length;

const getDeadNeighbors = (liveCells: number[][]): number[][] => {
  const liveSet = new Set(liveCells.map(cellKey));
  const seen = new Set<string>();
  const deadNeighbors: number[][] = [];

  for (const cell of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const candidate = [cell[0] + dx, cell[1] + dy];
        const key = cellKey(candidate);
        if (!liveSet.has(key) && !seen.has(key)) {
          seen.add(key);
          deadNeighbors.push(candidate);
        }
      }
    }
  }

  return deadNeighbors;
};

export function nextGeneration(liveCells: number[][]): number[][] {
  const survivors = liveCells.filter((cell) => {
    const neighborCount = countLiveNeighbors(cell, liveCells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const births = getDeadNeighbors(liveCells).filter(
    (cell) => countLiveNeighbors(cell, liveCells) === 3
  );

  return [...survivors, ...births];
}
