export function simulate(aliveCells: number[][], steps: number): number[][] {
  let cells = aliveCells;
  for (let step = 0; step < steps; step++) {
    cells = nextGeneration(cells);
  }
  return cells;
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function nextGeneration(aliveCells: number[][]): number[][] {
  const alive = new Set(aliveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      }
    }
  }

  const nextAliveCells: number[][] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && alive.has(key))) {
      const [x, y] = key.split(",").map(Number);
      nextAliveCells.push([x, y]);
    }
  }

  nextAliveCells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return nextAliveCells;
}
