export type Cell = [number, number];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function getNeighborCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function countNeighbors(cell: Cell, live: Set<string>): number {
  return getNeighborCells(cell).filter((neighbor) =>
    live.has(cellKey(neighbor)),
  ).length;
}

function compareCells([ax, ay]: Cell, [bx, by]: Cell): number {
  return ax - bx || ay - by;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));
  const next: Cell[] = [];

  for (const cell of cells) {
    const neighbors = countNeighbors(cell, live);
    if (neighbors === 2 || neighbors === 3) {
      next.push(cell);
    }
  }

  const birthCandidates = new Set<string>();
  for (const cell of cells) {
    for (const neighbor of getNeighborCells(cell)) {
      const key = cellKey(neighbor);
      if (!live.has(key)) {
        birthCandidates.add(key);
      }
    }
  }

  for (const key of birthCandidates) {
    const cell = parseKey(key);
    if (countNeighbors(cell, live) === 3) {
      next.push(cell);
    }
  }

  return next.sort(compareCells);
}
