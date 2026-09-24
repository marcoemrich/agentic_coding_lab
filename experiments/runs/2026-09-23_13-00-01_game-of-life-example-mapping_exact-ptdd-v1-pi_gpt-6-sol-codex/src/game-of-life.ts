export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function countLivingNeighbors(cells: Cell[], [x, y]: Cell): number {
  return cells.filter(([otherX, otherY]) =>
    (otherX !== x || otherY !== y) &&
    Math.abs(otherX - x) <= 1 && Math.abs(otherY - y) <= 1
  ).length;
}

function survives(neighbors: number): boolean {
  return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function reproduces(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
}

function generationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const candidate: Cell = [x + dx, y + dy];
        candidates.set(JSON.stringify(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cell => JSON.stringify(cell)));
  return generationCandidates(cells).filter(cell => {
    const neighbors = countLivingNeighbors(cells, cell);
    return alive.has(JSON.stringify(cell)) ? survives(neighbors) : reproduces(neighbors);
  });
}
