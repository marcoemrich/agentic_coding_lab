type Cell = [number, number];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function neighbors(x: number, y: number): Cell[] {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y],                  [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(([x, y]) => key(x, y)));

  // Count neighbor occurrences for all candidate cells
  const neighborCount = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const k = key(nx, ny);
      neighborCount.set(k, (neighborCount.get(k) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [k, count] of neighborCount) {
    const [x, y] = k.split(",").map(Number) as [number, number];
    if (alive.has(k)) {
      // Survival: live cell with 2 or 3 neighbors lives on
      if (count === 2 || count === 3) next.push([x, y]);
    } else {
      // Reproduction: dead cell with exactly 3 neighbors becomes alive
      if (count === 3) next.push([x, y]);
    }
  }

  return next;
}
