type Cell = [number, number];

const isNeighbor = ([cx, cy]: Cell, [nx, ny]: Cell): boolean =>
  Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1 && !(nx === cx && ny === cy);

const neighborCount = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((other) => isNeighbor(cell, other)).length;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const deadNeighbors = (liveCells: Cell[]): Cell[] => {
  const liveSet = new Set(liveCells.map(cellKey));
  const seen = new Set<string>();
  const result: Cell[] = [];
  for (const [cx, cy] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const candidate: Cell = [cx + dx, cy + dy];
        const key = cellKey(candidate);
        if (!liveSet.has(key) && !seen.has(key)) {
          seen.add(key);
          result.push(candidate);
        }
      }
    }
  }
  return result;
};

export const evolve = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) => {
    const neighbors = neighborCount(cell, liveCells);
    return neighbors === 2 || neighbors === 3;
  });
  const born = deadNeighbors(liveCells).filter(
    (cell) => neighborCount(cell, liveCells) === 3
  );
  return survivors.concat(born);
};
