export type Cell = [number, number];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();

  for (const [cellX, cellY] of liveCells) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        const candidate: Cell = [cellX + xOffset, cellY + yOffset];
        candidates.set(candidate.join(","), candidate);
      }
    }
  }

  return [...candidates.values()].filter(([cellX, cellY]) => {
    const liveNeighborCount = liveCells.filter(
      ([neighborX, neighborY]) =>
        Math.max(
          Math.abs(neighborX - cellX),
          Math.abs(neighborY - cellY),
        ) === 1,
    ).length;
    const isAlive = liveCells.some(([x, y]) => x === cellX && y === cellY);

    return liveNeighborCount === 3 ||
      (isAlive && liveNeighborCount === 2);
  });
}
