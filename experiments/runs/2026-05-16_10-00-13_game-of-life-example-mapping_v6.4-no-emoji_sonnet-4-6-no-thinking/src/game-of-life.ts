type Cell = [row: number, col: number];

function countNeighbors(cells: Cell[], row: number, col: number): number {
  return cells.filter(([cellRow, cellCol]) =>
    !(cellRow === row && cellCol === col) &&
    Math.abs(cellRow - row) <= 1 &&
    Math.abs(cellCol - col) <= 1
  ).length;
}

const survives = (neighborCount: number): boolean =>
  neighborCount === 2 || neighborCount === 3;

const bornFromDead = (neighborCount: number): boolean =>
  neighborCount === 3;

function deadNeighbors(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([r, c]) => `${r},${c}`));
  const candidates = new Map<string, Cell>();
  for (const [row, col] of cells) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const key = `${row + dr},${col + dc}`;
        if (!live.has(key)) {
          candidates.set(key, [row + dr, col + dc]);
        }
      }
    }
  }
  return Array.from(candidates.values());
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter(([row, col]) =>
    survives(countNeighbors(cells, row, col))
  );
  const born = deadNeighbors(cells).filter(([row, col]) =>
    bornFromDead(countNeighbors(cells, row, col))
  );
  return [...survivors, ...born];
}
