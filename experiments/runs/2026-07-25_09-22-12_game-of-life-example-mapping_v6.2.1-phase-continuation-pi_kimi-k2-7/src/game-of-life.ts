type Cell = readonly [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function compareCellsByYThenX(a: Cell, b: Cell): number {
  return a[1] === b[1] ? a[0] - b[0] : a[1] - b[1];
}

/**
 * Computes the next generation of live cells for Conway's Game of Life.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && live.has(key))) {
      next.push(parseCellKey(key));
    }
  }

  return next.sort(compareCellsByYThenX);
}
