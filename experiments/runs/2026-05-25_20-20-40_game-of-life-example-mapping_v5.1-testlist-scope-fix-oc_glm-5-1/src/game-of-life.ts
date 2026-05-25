type Cell = [number, number];

const NEIGHBOR_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function countLiveNeighbors(x: number, y: number, live: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (live.has(cellKey([x + dx, y + dy]))) {
      count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));
  const checkedDead = new Set<string>();
  const result: Cell[] = [];

  for (const cell of cells) {
    const [x, y] = cell;
    let liveNeighborCount = 0;

    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      if (live.has(cellKey([nx, ny]))) {
        liveNeighborCount++;
      } else {
        const deadKey = cellKey([nx, ny]);
        if (!checkedDead.has(deadKey)) {
          checkedDead.add(deadKey);
          if (countLiveNeighbors(nx, ny, live) === 3) {
            result.push([nx, ny]);
          }
        }
      }
    }

    if (liveNeighborCount === 2 || liveNeighborCount === 3) {
      result.push(cell);
    }
  }

  return result;
}
