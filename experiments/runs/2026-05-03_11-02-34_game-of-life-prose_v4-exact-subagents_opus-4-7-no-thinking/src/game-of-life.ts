type Cell = [number, number];

const areNeighbors = ([x1, y1]: Cell, [x2, y2]: Cell): boolean => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return (dx !== 0 || dy !== 0) && Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
};

const countLivingNeighbors = (cell: Cell, livingCells: Cell[]): number =>
  livingCells.filter((other) => areNeighbors(cell, other)).length;

const survivesToNextGeneration = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const isBornNextGeneration = (neighborCount: number): boolean =>
  neighborCount === 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const deadNeighborsOf = (livingCells: Cell[]): Cell[] => {
  const livingKeys = new Set(livingCells.map(cellKey));
  const deadCells = new Map<string, Cell>();
  for (const [x, y] of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const candidate: Cell = [x + dx, y + dy];
        const key = cellKey(candidate);
        if (!livingKeys.has(key)) {
          deadCells.set(key, candidate);
        }
      }
    }
  }
  return [...deadCells.values()];
};

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const survivors = livingCells.filter((cell) =>
    survivesToNextGeneration(countLivingNeighbors(cell, livingCells)),
  );

  const born = deadNeighborsOf(livingCells).filter((cell) =>
    isBornNextGeneration(countLivingNeighbors(cell, livingCells)),
  );

  return [...survivors, ...born];
}
