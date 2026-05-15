type Cell = [number, number];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const key = (x: number, y: number): string => `${x},${y}`;
  const living = new Set<string>(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = key(nx, ny);
        neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const survives = count === 3 || (count === 2 && living.has(k));
    if (survives) {
      const [xStr, yStr] = k.split(",");
      result.push([Number(xStr), Number(yStr)]);
    }
  }

  return result;
};
