type Cell = [number, number];

const isAlive = (cells: Cell[], x: number, y: number): boolean =>
  cells.some(([cx, cy]) => cx === x && cy === y);

const neighborCount = (cells: Cell[], x: number, y: number): number =>
  cells.filter(([cx, cy]) =>
    Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1 && !(cx === x && cy === y)
  ).length;

const deadNeighbors = (cells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  const result: Cell[] = [];
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (!isAlive(cells, nx, ny) && !seen.has(key)) {
          seen.add(key);
          result.push([nx, ny]);
        }
      }
    }
  }
  return result;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const survivors = cells.filter(([x, y]) => {
    const neighbors = neighborCount(cells, x, y);
    return neighbors === 2 || neighbors === 3;
  });

  const born = deadNeighbors(cells).filter(([x, y]) =>
    neighborCount(cells, x, y) === 3
  );

  return [...survivors, ...born].sort(([ax, ay], [bx, by]) => ay !== by ? ay - by : ax - bx);
};
