type Cell = [number, number];

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));

  function countLiveNeighbors(x: number, y: number): number {
    let neighbors = 0;

    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      if (liveKeys.has(cellKey([x + dx, y + dy]))) {
        neighbors++;
      }
    }

    return neighbors;
  }

  const survivors = cells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y);
    return neighbors === 2 || neighbors === 3;
  });

  const births = new Map<string, Cell>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + dx, y + dy];

      if (liveKeys.has(cellKey(candidate))) {
        continue;
      }

      if (countLiveNeighbors(candidate[0], candidate[1]) === 3) {
        births.set(cellKey(candidate), candidate);
      }
    }
  }

  return [...survivors, ...births.values()];
}
