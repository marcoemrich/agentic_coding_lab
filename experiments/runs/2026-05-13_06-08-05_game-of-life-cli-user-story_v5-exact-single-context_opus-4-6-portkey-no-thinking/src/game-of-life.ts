function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countAliveNeighbors(x: number, y: number, alive: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (alive.has(cellKey(x + dx, y + dy))) count++;
    }
  }
  return count;
}

function tick(cells: [number, number][]): [number, number][] {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const survivors = cells.filter(([x, y]) => {
    const n = countAliveNeighbors(x, y, alive);
    return n === 2 || n === 3;
  });

  const deadNeighbors = new Map<string, [number, number]>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        if (!alive.has(key)) {
          deadNeighbors.set(key, [x + dx, y + dy]);
        }
      }
    }
  }

  const born: [number, number][] = [];
  for (const [, [x, y]] of deadNeighbors) {
    if (countAliveNeighbors(x, y, alive) === 3) born.push([x, y]);
  }

  return [...survivors, ...born];
}

export function evolve(aliveCells: [number, number][], steps: number): [number, number][] {
  let cells = aliveCells;
  for (let step = 0; step < steps; step++) {
    cells = tick(cells);
  }
  return cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
