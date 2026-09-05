export type Cell = [number, number];

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const candidateCells = new Map<string, Cell>();
  for (const [x, y] of currentGeneration) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        candidateCells.set(`${x + offsetX},${y + offsetY}`, [x + offsetX, y + offsetY]);
      }
    }
  }
  return [...candidateCells.values()].filter(([x, y]) => {
    const liveNeighborCount = currentGeneration.filter(([neighborX, neighborY]) =>
      Math.abs(neighborX - x) <= 1 && Math.abs(neighborY - y) <= 1 && (neighborX !== x || neighborY !== y)
    ).length;
    const isAlive = currentGeneration.some(([cellX, cellY]) => cellX === x && cellY === y);
    return liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);
  });
}
