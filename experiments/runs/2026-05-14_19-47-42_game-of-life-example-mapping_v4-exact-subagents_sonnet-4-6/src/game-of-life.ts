type Cell = [number, number];
type Cells = Cell[];

const isNeighbor = (x: number, y: number, cx: number, cy: number): boolean =>
  Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1 && !(cx === x && cy === y);

const containsCell = (cells: Cells, x: number, y: number): boolean =>
  cells.some(([cx, cy]) => cx === x && cy === y);

const countNeighbors = (cells: Cells, x: number, y: number): number =>
  cells.filter(([cx, cy]) => isNeighbor(x, y, cx, cy)).length;

export function nextGeneration(cells: Cells): Cells {
  const survivors = cells.filter(([x, y]) => {
    const neighborCount = countNeighbors(cells, x, y);
    return neighborCount === 2 || neighborCount === 3;
  });

  const candidates: Cells = [];
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const isAlive = containsCell(cells, nx, ny);
        const alreadyAdded = containsCell(candidates, nx, ny);
        if (!isAlive && !alreadyAdded) {
          candidates.push([nx, ny]);
        }
      }
    }
  }

  const revived = candidates.filter(([x, y]) => {
    if (countNeighbors(cells, x, y) !== 3) return false;
    const liveNeighbors = cells.filter(([cx, cy]) => isNeighbor(x, y, cx, cy));
    return liveNeighbors.some(([nx, ny]) => {
      const neighborCount = countNeighbors(cells, nx, ny);
      return neighborCount === 2 || neighborCount === 3;
    });
  });

  return [...survivors, ...revived];
}
