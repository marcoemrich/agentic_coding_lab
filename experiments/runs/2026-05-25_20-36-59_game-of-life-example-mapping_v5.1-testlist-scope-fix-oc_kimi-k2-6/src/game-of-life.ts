type Cell = [number, number];

const NEIGHBOR_DELTAS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(',').map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(c => cellKey(c[0], c[1])));
  const survivors: Cell[] = [];
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    let neighbors = 0;
    for (const [dx, dy] of NEIGHBOR_DELTAS) {
      const neighborKey = cellKey(cell[0] + dx, cell[1] + dy);
      const isLive = liveSet.has(neighborKey);
      neighbors += isLive ? 1 : 0;
      if (!isLive) {
        neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) || 0) + 1);
      }
    }
    if (neighbors === 2 || neighbors === 3) {
      survivors.push(cell);
    }
  }

  const births: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3) {
      births.push(parseKey(key));
    }
  }

  return [...survivors, ...births];
}
