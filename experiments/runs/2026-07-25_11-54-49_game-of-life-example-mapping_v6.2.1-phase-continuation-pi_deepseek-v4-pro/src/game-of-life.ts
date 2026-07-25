export type Cell = [number, number]; // [x, y]

function cellToKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function keyToCell(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLivingNeighbors(liveCells: Cell[]): Map<string, number> {
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellToKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }
  return neighborCounts;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const neighborCounts = countLivingNeighbors(liveCells);
  const liveSet = new Set(liveCells.map(cellToKey));
  const nextCells: Cell[] = [];

  for (const [key, count] of neighborCounts) {
    const isAlive = liveSet.has(key);
    const survives = isAlive && (count === 2 || count === 3);
    const revives = !isAlive && count === 3;
    if (survives || revives) {
      nextCells.push(keyToCell(key));
    }
  }

  return nextCells;
}