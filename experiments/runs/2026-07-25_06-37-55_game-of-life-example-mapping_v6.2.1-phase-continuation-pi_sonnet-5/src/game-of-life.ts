export type Cell = readonly [number, number];

function neighborsOf([x, y]: Cell): Cell[] {
  const offsets = [-1, 0, 1];
  const result: Cell[] = [];
  for (const dx of offsets) {
    for (const dy of offsets) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
}

function cellToKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function keyToCell(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(cell: Cell, aliveKeys: Set<string>): number {
  return neighborsOf(cell).filter((n) => aliveKeys.has(cellToKey(n))).length;
}

function willBeAlive(isCurrentlyAlive: boolean, liveNeighborCount: number): boolean {
  if (isCurrentlyAlive) {
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  }
  return liveNeighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellToKey));

  const candidateKeys = new Set<string>();
  for (const cell of cells) {
    candidateKeys.add(cellToKey(cell));
    for (const neighbor of neighborsOf(cell)) {
      candidateKeys.add(cellToKey(neighbor));
    }
  }

  const result: Cell[] = [];
  for (const key of candidateKeys) {
    const cell = keyToCell(key);
    const liveNeighborCount = countLiveNeighbors(cell, aliveKeys);
    const isCurrentlyAlive = aliveKeys.has(key);

    if (willBeAlive(isCurrentlyAlive, liveNeighborCount)) {
      result.push(cell);
    }
  }

  return result;
}
