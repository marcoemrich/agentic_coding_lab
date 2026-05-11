function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborKeys(x: number, y: number): string[] {
  const keys: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      keys.push(toKey(x + dx, y + dy));
    }
  }
  return keys;
}

function countNeighbors(x: number, y: number, alive: Set<string>): number {
  return neighborKeys(x, y).filter((key) => alive.has(key)).length;
}

export function nextGeneration(cells: [number, number][]): [number, number][] {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const survivors = cells.filter(([x, y]) => {
    const neighbors = countNeighbors(x, y, alive);
    return neighbors === 2 || neighbors === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const key of neighborKeys(x, y)) {
      if (!alive.has(key)) deadCandidates.add(key);
    }
  }

  const born: [number, number][] = [];
  for (const key of deadCandidates) {
    const [x, y] = parseKey(key);
    if (countNeighbors(x, y, alive) === 3) {
      born.push([x, y]);
    }
  }

  return [...survivors, ...born];
}
