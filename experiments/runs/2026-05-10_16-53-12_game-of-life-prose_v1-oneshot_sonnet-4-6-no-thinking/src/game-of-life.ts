export type Cell = [number, number];
export type Grid = Set<string>;

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
}

export function createGrid(cells: Cell[]): Grid {
  const grid = new Set<string>();
  for (const [x, y] of cells) {
    grid.add(key(x, y));
  }
  return grid;
}

export function getCells(grid: Grid): Cell[] {
  return Array.from(grid).map(parseKey);
}

export function nextGeneration(grid: Grid): Grid {
  const neighborCount = new Map<string, number>();

  for (const k of grid) {
    const [x, y] = parseKey(k);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nk = key(x + dx, y + dy);
        neighborCount.set(nk, (neighborCount.get(nk) ?? 0) + 1);
      }
    }
  }

  const next = new Set<string>();
  for (const [k, count] of neighborCount) {
    if (count === 3 || (count === 2 && grid.has(k))) {
      next.add(k);
    }
  }
  return next;
}
