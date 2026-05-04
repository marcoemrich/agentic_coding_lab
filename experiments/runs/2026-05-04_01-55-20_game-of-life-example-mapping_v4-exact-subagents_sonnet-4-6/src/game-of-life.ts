const containsCell = (grid: [number, number][], [x, y]: [number, number]): boolean =>
  grid.some(([cx, cy]) => cx === x && cy === y);

const countNeighbors = (cell: [number, number], cells: [number, number][]): number => {
  const [x, y] = cell;
  return cells.filter(([cx, cy]) =>
    !(cx === x && cy === y) &&
    Math.abs(cx - x) <= 1 &&
    Math.abs(cy - y) <= 1
  ).length;
};

const deadNeighborCandidates = (cells: [number, number][]): [number, number][] => {
  const candidates: [number, number][] = [];
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (!containsCell(cells, [nx, ny]) && !containsCell(candidates, [nx, ny])) {
          candidates.push([nx, ny]);
        }
      }
    }
  }
  return candidates;
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const survivors = cells.filter(cell => {
    const neighborCount = countNeighbors(cell, cells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const born = deadNeighborCandidates(cells).filter(cell => countNeighbors(cell, cells) === 3);

  return [...survivors, ...born];
};
