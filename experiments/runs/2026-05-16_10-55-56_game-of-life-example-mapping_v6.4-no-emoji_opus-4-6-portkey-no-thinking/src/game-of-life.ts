type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

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

const countLiveNeighbors = (cell: Cell, alive: Set<string>): number =>
  neighborsOf(cell).filter((n) => alive.has(cellKey(n))).length;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map((c) => cellKey(c)));

  const survivors = cells.filter((cell) => {
    const neighbors = countLiveNeighbors(cell, alive);
    return neighbors === 2 || neighbors === 3;
  });

  const deadCandidates = new Set<string>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      if (!alive.has(key)) deadCandidates.add(key);
    }
  }

  const births: Cell[] = [];
  for (const key of deadCandidates) {
    const cell: Cell = key.split(",").map(Number) as Cell;
    if (countLiveNeighbors(cell, alive) === 3) {
      births.push(cell);
    }
  }

  return [...survivors, ...births];
}
