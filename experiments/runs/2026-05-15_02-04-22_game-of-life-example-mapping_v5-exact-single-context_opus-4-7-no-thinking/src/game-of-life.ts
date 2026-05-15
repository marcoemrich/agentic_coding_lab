export type Cell = [number, number];

function isNeighbor(a: Cell, b: Cell): boolean {
  const [ax, ay] = a;
  const [bx, by] = b;
  if (ax === bx && ay === by) return false;
  return Math.abs(ax - bx) <= 1 && Math.abs(ay - by) <= 1;
}

function countNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((other) => isNeighbor(cell, other)).length;
}

function survives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function candidateDeadCells(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const c: Cell = [x + dx, y + dy];
        const k = cellKey(c);
        if (!live.has(k)) candidates.set(k, c);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const surviving = cells.filter((cell) => survives(countNeighbors(cell, cells)));
  const born = candidateDeadCells(cells).filter((cell) => countNeighbors(cell, cells) === 3);
  return [...surviving, ...born];
}
