const parseCell = (cell: string): [number, number] => {
  const [x, y] = cell.split(",").map(Number);
  return [x, y];
};

const cellKey = (x: number, y: number): string => `${x},${y}`;

const forEachNeighbor = (cell: string, fn: (neighbor: string) => void): void => {
  const [x, y] = parseCell(cell);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      fn(cellKey(x + dx, y + dy));
    }
  }
};

const countLiveNeighbors = (cell: string, livingCells: Set<string>): number => {
  let count = 0;
  forEachNeighbor(cell, (n) => {
    if (livingCells.has(n)) count++;
  });
  return count;
};

export const nextGeneration = (livingCells: Set<string>): Set<string> => {
  const candidates = new Set<string>();
  for (const cell of livingCells) {
    candidates.add(cell);
    forEachNeighbor(cell, (n) => candidates.add(n));
  }
  const result = new Set<string>();
  for (const cell of candidates) {
    const n = countLiveNeighbors(cell, livingCells);
    if (n === 3 || (n === 2 && livingCells.has(cell))) result.add(cell);
  }
  return result;
};
