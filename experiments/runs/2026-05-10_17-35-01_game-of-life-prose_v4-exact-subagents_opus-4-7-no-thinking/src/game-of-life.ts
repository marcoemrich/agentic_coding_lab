function* neighborsOf(cell: string): Generator<string> {
  const [x, y] = cell.split(",").map(Number);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      yield `${x + dx},${y + dy}`;
    }
  }
}

function isAliveNext(isCurrentlyAlive: boolean, liveNeighborCount: number): boolean {
  if (isCurrentlyAlive) return liveNeighborCount === 2 || liveNeighborCount === 3;
  return liveNeighborCount === 3;
}

export function nextGeneration(livingCells: Set<string>): Set<string> {
  const neighborCounts = new Map<string, number>();
  for (const cell of livingCells) {
    for (const neighbor of neighborsOf(cell)) {
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }
  const nextGen = new Set<string>();
  for (const [cell, count] of neighborCounts) {
    if (isAliveNext(livingCells.has(cell), count)) nextGen.add(cell);
  }
  return nextGen;
}
