const cellKey = (x: number, y: number): string => `${x},${y}`;

const keyToCoords = (key: string): [number, number] => {
  const [x, y] = key.split(',').map(Number) as [number, number];
  return [x, y];
};

const getNeighborKeys = (x: number, y: number): string[] => {
  const neighbors: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push(cellKey(x + dx, y + dy));
    }
  }
  return neighbors;
};

const countLiveNeighbors = (x: number, y: number, livingCells: Set<string>): number => {
  let count = 0;
  for (const neighborKey of getNeighborKeys(x, y)) {
    if (livingCells.has(neighborKey)) {
      count++;
    }
  }
  return count;
};

const shouldSurvive = (liveNeighbors: number): boolean => {
  return liveNeighbors === 2 || liveNeighbors === 3;
};

const shouldBeBorn = (liveNeighbors: number): boolean => {
  return liveNeighbors === 3;
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const livingCells = new Set(cells.map(c => cellKey(c[0], c[1])));
  const survivors: [number, number][] = [];

  // Check live cells for survival
  for (const [x, y] of cells) {
    const liveNeighbors = countLiveNeighbors(x, y, livingCells);
    if (shouldSurvive(liveNeighbors)) {
      survivors.push([x, y]);
    }
  }

  // Check dead cells for reproduction
  const candidateDeadCells = new Set<string>();
  for (const [x, y] of cells) {
    for (const neighborKey of getNeighborKeys(x, y)) {
      if (!livingCells.has(neighborKey)) {
        candidateDeadCells.add(neighborKey);
      }
    }
  }

  for (const key of candidateDeadCells) {
    const [x, y] = keyToCoords(key);
    const liveNeighbors = countLiveNeighbors(x, y, livingCells);
    if (shouldBeBorn(liveNeighbors)) {
      survivors.push([x, y]);
    }
  }

  return survivors;
};
