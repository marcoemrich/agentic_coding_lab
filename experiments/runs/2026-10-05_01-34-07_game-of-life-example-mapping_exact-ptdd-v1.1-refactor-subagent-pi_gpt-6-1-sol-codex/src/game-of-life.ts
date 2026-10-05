type Cell = [number, number];

const TWO_NEIGHBORS = 2;
const THREE_NEIGHBORS = 3;

function cellKey(cell: Cell): string {
  return cell.join(',');
}

function isNeighborOffset(dx: number, dy: number): boolean {
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0);
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return isNeighborOffset(x - otherX, y - otherY);
}

function liveCellSurvives(neighbors: number): boolean {
  return neighbors === TWO_NEIGHBORS || neighbors === THREE_NEIGHBORS;
}

function deadCellIsBorn(neighbors: number): boolean {
  return neighbors === THREE_NEIGHBORS;
}

function countLiveNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter(other => areNeighbors(cell, other)).length;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (isNeighborOffset(dx, dy)) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function deadNeighborCandidates(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();
  for (const cell of cells.flatMap(neighboringCells)) {
    candidates.set(cellKey(cell), cell);
  }
  return [...candidates.values()].filter(cell => !living.has(cellKey(cell)));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(cell => liveCellSurvives(countLiveNeighbors(cell, cells)));
  const births = deadNeighborCandidates(cells).filter(cell =>
    deadCellIsBorn(countLiveNeighbors(cell, cells)),
  );
  return [...survivors, ...births];
}
