type Cell = [number, number];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.set(`${x + dx},${y + dy}`, [x + dx, y + dy]);
      }
    }
  }
  return [...candidates.values()].filter(([x, y]) => {
    const liveNeighborCount = liveCells.filter(([liveX, liveY]) =>
      Math.abs(liveX - x) <= 1 && Math.abs(liveY - y) <= 1 &&
      (liveX !== x || liveY !== y)
    ).length;
    return liveNeighborCount === 3 || (liveNeighborCount === 2 &&
      liveCells.some(([liveX, liveY]) => liveX === x && liveY === y));
  });
}
