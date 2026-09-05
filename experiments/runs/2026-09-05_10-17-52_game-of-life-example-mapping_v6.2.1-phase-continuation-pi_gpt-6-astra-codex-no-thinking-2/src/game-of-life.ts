type Cell = [number, number];

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(otherX - x) <= 1 && Math.abs(otherY - y) <= 1 &&
    (otherX !== x || otherY !== y);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cell: Cell = [x + dx, y + dy];
        candidates.set(String(cell), cell);
      }
    }
  }
  return [...candidates.values()].filter(cell => {
    const liveNeighborCount = liveCells.filter(liveCell =>
      areNeighbors(cell, liveCell)
    ).length;
    const isAlive = liveCells.some(liveCell => String(liveCell) === String(cell));
    return (isAlive && liveNeighborCount === 2) || liveNeighborCount === 3;
  });
}
