type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(count, liveCells.has(key))) {
      survivors.push(fromKey(key));
    }
  }
  return survivors;
}

function survivesOrIsBorn(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighborsOf(x, y)) {
      const key = toKey([nx, ny]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function* neighborsOf(x: number, y: number): Generator<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) yield [x + dx, y + dy];
    }
  }
}

function toKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
}
