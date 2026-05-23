export type Cell = [number, number];

const encode = (x: number, y: number): string => `${x},${y}`;

const decode = (key: string): Cell => {
  const comma = key.indexOf(",");
  return [Number(key.slice(0, comma)), Number(key.slice(comma + 1))];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<string>(cells.map(([x, y]) => encode(x, y)));
  const neighborCounts = countNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(count, liveCells.has(key))) {
      nextCells.push(decode(key));
    }
  }
  return nextCells;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = encode(x + dx, y + dy);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function survivesOrIsBorn(neighborCount: number, isAlive: boolean): boolean {
  return isAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;
}
