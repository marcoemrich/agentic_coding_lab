export type Cell = [number, number];

const NEIGHBOR_DELTAS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(
  x: number,
  y: number,
  liveCellKeys: Set<string>,
): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_DELTAS) {
    if (liveCellKeys.has(cellKey(x + dx, y + dy))) {
      count++;
    }
  }
  return count;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));

  const survivors = liveCells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y, liveCellKeys);
    return neighbors === 2 || neighbors === 3;
  });

  const births: Cell[] = [];
  const checkedBirthCells = new Set<string>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_DELTAS) {
      const nx = x + dx;
      const ny = y + dy;
      const neighborKey = cellKey(nx, ny);

      if (liveCellKeys.has(neighborKey)) continue;
      if (checkedBirthCells.has(neighborKey)) continue;
      checkedBirthCells.add(neighborKey);

      if (countLiveNeighbors(nx, ny, liveCellKeys) === 3) {
        births.push([nx, ny]);
      }
    }
  }

  return [...survivors, ...births];
}
