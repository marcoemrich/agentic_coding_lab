export type Cell = [number, number];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const candidateCells = new Map<string, Cell>();

  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        candidateCells.set(`${x + dx},${y + dy}`, [x + dx, y + dy]);
      }
    }
  }

  return [...candidateCells.values()].filter(([x, y]) => {
    const liveNeighborCount = liveCells.filter(
      ([otherX, otherY]) =>
        (otherX !== x || otherY !== y) &&
        Math.abs(otherX - x) <= 1 &&
        Math.abs(otherY - y) <= 1,
    ).length;
    const isAlive = liveCells.some(([liveX, liveY]) => liveX === x && liveY === y);

    return liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);
  });
}
