type Cell = [number, number]; // [x, y]

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function neighbors(x: number, y: number): Cell[] {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
}

type Candidate = { cell: Cell; liveNeighbors: number };

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));

  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const k = key(nx, ny);
      const existing = candidates.get(k);
      if (existing) {
        existing.liveNeighbors++;
      } else {
        candidates.set(k, { cell: [nx, ny], liveNeighbors: 1 });
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, { cell, liveNeighbors }] of candidates) {
    const isAlive = live.has(k);
    const willLive =
      liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);
    if (willLive) {
      result.push(cell);
    }
  }

  return result;
}
