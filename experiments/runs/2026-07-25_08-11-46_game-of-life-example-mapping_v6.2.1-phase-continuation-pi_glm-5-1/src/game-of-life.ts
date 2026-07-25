type Cell = [number, number];

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];

  const liveSet = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const survivors = cells.filter(([x, y]) => {
    const count = neighborCounts.get(toKey(x, y)) ?? 0;
    return count === 2 || count === 3;
  });

  const births: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 && !liveSet.has(key)) {
      births.push(fromKey(key));
    }
  }

  return [...survivors, ...births];
}
