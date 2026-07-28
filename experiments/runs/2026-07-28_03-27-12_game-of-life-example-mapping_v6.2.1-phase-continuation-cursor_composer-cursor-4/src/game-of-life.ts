export type Cell = [number, number];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function parseCell(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cell: Cell, liveSet: Set<string>): number {
  let count = 0;
  for (const neighbor of neighborCells(cell)) {
    if (liveSet.has(cellKey(neighbor))) count++;
  }
  return count;
}

function survives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === 3;
}

function willLive(isAlive: boolean, neighborCount: number): boolean {
  return isAlive ? survives(neighborCount) : isBorn(neighborCount);
}

function neighborCells(cell: Cell): Cell[] {
  const [x, y] = cell;
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  if (liveCells.length === 0) {
    return [];
  }

  const liveSet = new Set(liveCells.map(cellKey));
  const candidates = new Set<string>();

  for (const cell of liveCells) {
    candidates.add(cellKey(cell));
    for (const neighbor of neighborCells(cell)) {
      candidates.add(cellKey(neighbor));
    }
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const cell = parseCell(key);
    const neighborCount = countNeighbors(cell, liveSet);
    const isAlive = liveSet.has(key);

    if (willLive(isAlive, neighborCount)) {
      next.push(cell);
    }
  }

  return next.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
