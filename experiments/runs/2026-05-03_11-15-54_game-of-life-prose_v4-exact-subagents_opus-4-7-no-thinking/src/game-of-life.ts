export function nextGeneration(livingCells: Set<string>): Set<string> {
  const nextGen = new Set<string>();
  for (const cell of cellsToEvaluate(livingCells)) {
    const liveNeighborCount = countLiveNeighbors(cell, livingCells);
    if (liveNeighborCount === 3 || (liveNeighborCount === 2 && livingCells.has(cell))) {
      nextGen.add(cell);
    }
  }
  return nextGen;
}

function cellsToEvaluate(livingCells: Set<string>): Set<string> {
  const cells = new Set<string>();
  for (const cell of livingCells) {
    cells.add(cell);
    for (const neighbor of neighborsOf(cell)) cells.add(neighbor);
  }
  return cells;
}

function countLiveNeighbors(cell: string, livingCells: Set<string>): number {
  let count = 0;
  for (const neighbor of neighborsOf(cell)) {
    if (livingCells.has(neighbor)) count++;
  }
  return count;
}

function* neighborsOf(cell: string): Generator<string> {
  const [x, y] = cell.split(",").map(Number);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      yield `${x + dx},${y + dy}`;
    }
  }
}
