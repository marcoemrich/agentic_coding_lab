export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cell: Cell, liveCells: Cell[]): number {
  return liveCells.filter(
    (other) =>
      !(other[0] === cell[0] && other[1] === cell[1]) &&
      Math.abs(other[0] - cell[0]) <= 1 &&
      Math.abs(other[1] - cell[1]) <= 1
  ).length;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => {
    const neighborCount = countNeighbors(cell, liveCells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const deadCandidateKeys = new Set<string>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        if (!liveSet.has(key)) {
          deadCandidateKeys.add(key);
        }
      }
    }
  }

  const newborn: Cell[] = [];
  for (const key of deadCandidateKeys) {
    const candidate = parseKey(key);
    if (countNeighbors(candidate, liveCells) === 3) {
      newborn.push(candidate);
    }
  }

  return [...survivors, ...newborn];
}
