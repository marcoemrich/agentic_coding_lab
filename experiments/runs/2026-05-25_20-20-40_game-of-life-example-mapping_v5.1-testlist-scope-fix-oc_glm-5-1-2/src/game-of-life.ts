type Cell = [number, number];

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const toKey = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => toKey(x, y)));
  const result: Cell[] = [];
  const candidates = new Set<string>();

  for (const [x, y] of cells) {
    const neighbors = countLiveNeighbors(x, y, liveCells);
    if (neighbors === 2 || neighbors === 3) {
      result.push([x, y]);
    }
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      if (!liveCells.has(key)) {
        candidates.add(key);
      }
    }
  }

  for (const key of candidates) {
    const [x, y] = key.split(",").map(Number);
    if (countLiveNeighbors(x, y, liveCells) === 3) {
      result.push([x, y]);
    }
  }

  return result;
}

function countLiveNeighbors(x: number, y: number, liveCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.reduce(
    (count, [dx, dy]) => liveCells.has(toKey(x + dx, y + dy)) ? count + 1 : count,
    0,
  );
}
