type Cell = [number, number]; // [x, y]

export function nextGeneration(cells: Cell[]): Cell[] {
  const toKey = ([x, y]: Cell): string => `${x},${y}`;
  const alive = new Set(cells.map(toKey));

  const neighborsOf = ([x, y]: Cell): Cell[] => {
    const result: Cell[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        result.push([x + dx, y + dy]);
      }
    }
    return result;
  };

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter((n) => alive.has(toKey(n))).length;

  // A cell can change state only if it is alive or borders a live cell.
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(toKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(toKey(neighbor), neighbor);
    }
  }

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const neighborCount = countLiveNeighbors(cell);
    return alive.has(toKey(cell))
      ? neighborCount === 2 || neighborCount === 3
      : neighborCount === 3;
  };

  return [...candidates.values()].filter(isAliveNextGeneration);
}
