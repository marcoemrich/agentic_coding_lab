export type Cell = [number, number];

export function nextGeneration(aliveCells: Cell[], steps: number): Cell[] {
  let cells = aliveCells;
  for (let s = 0; s < steps; s++) {
    cells = step(cells);
  }
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function step(aliveCells: Cell[]): Cell[] {
  const alive = new Set(aliveCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of aliveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number) as Cell;
    if (count === 3 || (count === 2 && alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}
