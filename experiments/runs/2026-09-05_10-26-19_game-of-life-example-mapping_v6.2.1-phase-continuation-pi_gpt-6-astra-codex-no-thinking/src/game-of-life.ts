type Cell = [number, number];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const result = liveCells.filter(([x, y]) => {
    const liveNeighborCount = liveCells.filter(([candidateX, candidateY]) =>
      Math.abs(candidateX - x) <= 1 && Math.abs(candidateY - y) <= 1 &&
      (candidateX !== x || candidateY !== y)
    ).length;
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  });
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.set(`${x + dx},${y + dy}`, [x + dx, y + dy]);
      }
    }
  }
  for (const [x, y] of candidates.values()) {
    if (liveCells.some(([liveX, liveY]) => liveX === x && liveY === y)) continue;
    const liveNeighborCount = liveCells.filter(([liveX, liveY]) =>
      Math.abs(liveX - x) <= 1 && Math.abs(liveY - y) <= 1
    ).length;
    if (liveNeighborCount === 3) result.push([x, y]);
  }
  return result;
}
