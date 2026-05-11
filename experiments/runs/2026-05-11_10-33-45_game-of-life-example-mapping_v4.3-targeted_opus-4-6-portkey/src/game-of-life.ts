export type Cell = [number, number];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function countNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter(
    (other) =>
      !(other[0] === cell[0] && other[1] === cell[1]) &&
      Math.abs(other[0] - cell[0]) <= 1 &&
      Math.abs(other[1] - cell[1]) <= 1
  ).length;
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const livingSet = new Set(livingCells.map(cellKey));

  const survivors = livingCells.filter((cell) => {
    const neighborCount = countNeighbors(cell, livingCells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const deadCandidates = new Map<string, Cell>();
  for (const cell of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor: Cell = [cell[0] + dx, cell[1] + dy];
        if (!livingSet.has(cellKey(neighbor))) {
          deadCandidates.set(cellKey(neighbor), neighbor);
        }
      }
    }
  }

  const births: Cell[] = [];
  for (const [, candidate] of deadCandidates) {
    if (countNeighbors(candidate, livingCells) === 3) {
      births.push(candidate);
    }
  }

  return [...survivors, ...births];
}
