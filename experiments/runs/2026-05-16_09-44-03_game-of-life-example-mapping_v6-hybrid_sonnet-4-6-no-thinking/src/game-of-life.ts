export type Cell = [number, number];

function countNeighbors(cells: Cell[], x: number, y: number): number {
  return cells.filter(([cx, cy]) =>
    Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1 && !(cx === x && cy === y)
  ).length;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return cells.filter(([x, y]) =>
    [2, 3].includes(countNeighbors(cells, x, y))
  );
}
