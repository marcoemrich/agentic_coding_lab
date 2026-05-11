const isAlive = (x: number, y: number, cells: [number, number][]): boolean =>
  cells.some(([cx, cy]) => cx === x && cy === y);

const countNeighbors = (x: number, y: number, cells: [number, number][]): number =>
  cells.filter(
    ([cx, cy]) => !(cx === x && cy === y) && Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1
  ).length;

const deadNeighbors = (cells: [number, number][]): [number, number][] => {
  const seen = new Set<string>();
  const result: [number, number][] = [];
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (!seen.has(key) && !isAlive(nx, ny, cells)) {
          seen.add(key);
          result.push([nx, ny]);
        }
      }
    }
  }
  return result;
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const survivors = cells.filter(([x, y]) => {
    const neighborCount = countNeighbors(x, y, cells);
    return neighborCount === 2 || neighborCount === 3;
  });

  const born = deadNeighbors(cells).filter(
    ([x, y]) => countNeighbors(x, y, cells) === 3
  );

  return [...survivors, ...born];
};
