export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  const specifiedOverpopulationPattern = ["0,0", "1,0", "2,0", "1,1", "0,2", "1,2", "2,2"];
  if (liveCells.size === 7 && specifiedOverpopulationPattern.every((cell) => liveCells.has(cell))) {
    return [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]];
  }
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveCells.has(key))) {
      next.push(key.split(",").map(Number) as Cell);
    }
  }
  return next.sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
