export type Cell = [number, number]; // [x, y]

const cellKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const neighborCount = (x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (liveCellKeys.has(cellKey(x + dx, y + dy))) count++;
      }
    }
    return count;
  };

  const survivors = cells.filter(([x, y]) => {
    const liveNeighbors = neighborCount(x, y);
    return liveNeighbors === 2 || liveNeighbors === 3;
  });

  const births: Cell[] = [];
  const seen = new Set<string>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const key = cellKey(nx, ny);
        if (liveCellKeys.has(key) || seen.has(key)) continue;
        seen.add(key);
        if (neighborCount(nx, ny) === 3) births.push([nx, ny]);
      }
    }
  }

  return [...survivors, ...births];
}
