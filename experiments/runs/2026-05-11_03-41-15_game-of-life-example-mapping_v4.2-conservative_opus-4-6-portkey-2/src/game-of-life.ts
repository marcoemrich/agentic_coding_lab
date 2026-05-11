function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(
  livingCells: [number, number][]
): [number, number][] {
  const alive = new Set(livingCells.map(([x, y]) => cellKey(x, y)));

  const neighborOffsets: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  function countLiveNeighbors(x: number, y: number): number {
    let count = 0;
    for (const [dx, dy] of neighborOffsets) {
      if (alive.has(cellKey(x + dx, y + dy))) {
        count++;
      }
    }
    return count;
  }

  const result: [number, number][] = [];

  // Survival: live cells with 2 or 3 neighbors survive
  for (const [x, y] of livingCells) {
    const neighbors = countLiveNeighbors(x, y);
    if (neighbors === 2 || neighbors === 3) {
      result.push([x, y]);
    }
  }

  // Birth: dead cells adjacent to live cells with exactly 3 neighbors come alive
  const deadCandidates = new Set<string>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of neighborOffsets) {
      const key = cellKey(x + dx, y + dy);
      if (!alive.has(key)) {
        deadCandidates.add(key);
      }
    }
  }
  for (const key of deadCandidates) {
    const cell = parseKey(key);
    if (countLiveNeighbors(...cell) === 3) {
      result.push(cell);
    }
  }

  return result;
}
