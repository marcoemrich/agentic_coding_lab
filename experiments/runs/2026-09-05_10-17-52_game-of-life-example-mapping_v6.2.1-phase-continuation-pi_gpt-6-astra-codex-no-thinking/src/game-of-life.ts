export type Cell = [number, number];

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
  return [...candidates.values()].filter(([cellX, cellY]) => {
    const liveNeighborCount = liveCells.filter(([liveX, liveY]) =>
      Math.abs(cellX - liveX) <= 1 && Math.abs(cellY - liveY) <= 1 &&
      (cellX !== liveX || cellY !== liveY)
    ).length;
    const isAlive = liveCells.some(([x, y]) => x === cellX && y === cellY);
    return liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);
  });
}
