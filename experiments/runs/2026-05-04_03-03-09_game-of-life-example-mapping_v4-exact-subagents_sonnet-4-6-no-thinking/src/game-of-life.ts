const cellKey = (x: number, y: number): string => `${x},${y}`;

const fromKey = (key: string): [number, number] =>
  key.split(",").map(Number) as [number, number];

const neighborPositions = (x: number, y: number): [number, number][] => {
  const positions: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      positions.push([x + dx, y + dy]);
    }
  }
  return positions;
};

export function nextGeneration(cells: [number, number][]): [number, number][] {
  const liveSet = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const liveNeighborCount = (x: number, y: number): number =>
    neighborPositions(x, y).filter(([nx, ny]) => liveSet.has(cellKey(nx, ny))).length;

  const survivors = cells.filter(([x, y]) => {
    const n = liveNeighborCount(x, y);
    return n === 2 || n === 3;
  });

  const deadNeighborCandidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighborPositions(x, y)) {
      const key = cellKey(nx, ny);
      if (!liveSet.has(key)) deadNeighborCandidates.add(key);
    }
  }

  const born: [number, number][] = [];
  for (const key of deadNeighborCandidates) {
    const [x, y] = fromKey(key);
    if (liveNeighborCount(x, y) === 3) born.push([x, y]);
  }

  const result = [...survivors, ...born];
  result.sort(([ax, ay], [bx, by]) => ax !== bx ? ax - bx : ay - by);

  return result;
}
