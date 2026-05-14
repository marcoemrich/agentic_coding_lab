export type Cell = [number, number];

const isNeighbor = ([r, c]: Cell, [targetR, targetC]: Cell): boolean =>
  Math.abs(r - targetR) <= 1 && Math.abs(c - targetC) <= 1 && !(r === targetR && c === targetC);

const countNeighbors = (cell: Cell, cells: Cell[]): number =>
  cells.filter((other) => isNeighbor(other, cell)).length;

const deadNeighbors = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([r, c]) => `${r},${c}`));
  const candidates = new Map<string, Cell>();
  for (const [r, c] of cells) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const key = `${r + dr},${c + dc}`;
        if (!liveSet.has(key)) {
          candidates.set(key, [r + dr, c + dc]);
        }
      }
    }
  }
  return Array.from(candidates.values());
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const survivors = cells.filter((cell) => {
    const neighborCount = countNeighbors(cell, cells);
    return neighborCount === 2 || neighborCount === 3;
  });
  const newborns = deadNeighbors(cells).filter(
    (cell) => countNeighbors(cell, cells) === 3
  );
  return [...survivors, ...newborns];
}
