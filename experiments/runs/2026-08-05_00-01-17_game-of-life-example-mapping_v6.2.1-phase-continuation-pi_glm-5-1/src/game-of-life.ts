export type Cell = [number, number];

function toKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function fromKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighborKey = toKey([x + dx, y + dy]);
        counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function isSurvivor(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function isBirth(neighborCount: number): boolean {
  return neighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];

  const liveSet = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];

  // Survivors: live cells with 2 or 3 neighbors
  for (const cell of cells) {
    const key = toKey(cell);
    if (isSurvivor(neighborCounts.get(key) ?? 0)) {
      result.push(cell);
    }
  }

  // Births: dead cells with exactly 3 neighbors
  for (const [key, count] of neighborCounts) {
    if (!liveSet.has(key) && isBirth(count)) {
      result.push(fromKey(key));
    }
  }

  return result;
}
