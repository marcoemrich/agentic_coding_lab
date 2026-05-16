type Cell = [number, number];

const isNeighbor = (cx: number, cy: number, x: number, y: number): boolean =>
  Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1 && !(cx === x && cy === y);

function countNeighbors(liveCells: Cell[], x: number, y: number): number {
  return liveCells.filter(([cx, cy]) => isNeighbor(cx, cy, x, y)).length;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  return liveCells.filter(([x, y]) => {
    const neighborCount = countNeighbors(liveCells, x, y);
    return neighborCount === 2 || neighborCount === 3;
  });
}
