type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const isAlive = (cell: Cell): boolean => liveSet.has(key(cell[0], cell[1]));
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const survivors = cells.filter((cell) => {
    const count = liveNeighborCount(cell);
    return count === 2 || count === 3;
  });

  const deadNeighborKeys = new Set<string>();
  const deadNeighbors: Cell[] = [];
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const neighborKey = key(neighbor[0], neighbor[1]);
      if (!liveSet.has(neighborKey) && !deadNeighborKeys.has(neighborKey)) {
        deadNeighborKeys.add(neighborKey);
        deadNeighbors.push(neighbor);
      }
    }
  }

  const births = deadNeighbors.filter((cell) => liveNeighborCount(cell) === 3);

  return [...survivors, ...births];
}
