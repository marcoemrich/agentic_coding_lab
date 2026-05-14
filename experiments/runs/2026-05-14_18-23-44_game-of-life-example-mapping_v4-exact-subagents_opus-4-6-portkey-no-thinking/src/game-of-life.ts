export type Cell = [number, number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const isNeighbor = (cell: Cell, other: Cell): boolean =>
  !(other[0] === cell[0] && other[1] === cell[1]) &&
  Math.abs(other[0] - cell[0]) <= 1 &&
  Math.abs(other[1] - cell[1]) <= 1;

const countNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  livingCells.filter((other) => isNeighbor(cell, other)).length;

const findDeadNeighbors = (livingCells: Cell[]): Cell[] => {
  const livingSet = new Set(livingCells.map(cellKey));
  const deadNeighbors = new Map<string, Cell>();

  for (const cell of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const candidate: Cell = [cell[0] + dx, cell[1] + dy];
        const key = cellKey(candidate);
        if (!livingSet.has(key)) {
          deadNeighbors.set(key, candidate);
        }
      }
    }
  }

  return [...deadNeighbors.values()];
};

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const survivors = livingCells.filter((cell) => {
    const neighbors = countNeighbors(cell, livingCells);
    return neighbors === 2 || neighbors === 3;
  });

  const born = findDeadNeighbors(livingCells).filter(
    (cell) => countNeighbors(cell, livingCells) === 3
  );

  return [...survivors, ...born];
}
