type Cell = [x: number, y: number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = toKey([x + dx, y + dy]);
        neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      }
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, neighbors] of neighborCounts) {
    const isAlive = liveCells.has(key);
    const survivesOrIsBorn = neighbors === 3 || (neighbors === 2 && isAlive);
    if (survivesOrIsBorn) {
      nextCells.push(fromKey(key));
    }
  }

  return nextCells;
}
