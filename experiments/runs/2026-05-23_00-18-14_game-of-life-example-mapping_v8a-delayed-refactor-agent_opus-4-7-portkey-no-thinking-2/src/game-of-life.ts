export type Cell = [number, number];

function encodeCell(x: number, y: number): string {
  return `${x},${y}`;
}

function decodeCell(encoded: string): Cell {
  const [x, y] = encoded.split(",");
  return [Number(x), Number(y)];
}

function survives(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveCells = new Set<string>();
  for (const [x, y] of cells) {
    aliveCells.add(encodeCell(x, y));
  }

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighborKey = encodeCell(x + dx, y + dy);
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [cellKey, count] of neighborCounts) {
    if (survives(aliveCells.has(cellKey), count)) {
      nextCells.push(decodeCell(cellKey));
    }
  }

  return nextCells;
}
