export type Card = {
  monster: "sphinx" | "undead-warrior" | "zombie" | "hydra" | "cyclops" | "orthrus" | "chimera";
  rank?: number;
};

const BASE_SPHINX_SCORE = 1;
const STANDARD_SPHINX_SCORE = 2;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const TYPE_THRESHOLD = 3;

function countSphinx(army: Card[]): number {
  return army.filter(({ monster }) => monster === "sphinx").length;
}

function countTypesSeenBySphinx(army: Card[], sphinxCount: number): number {
  const types = new Set(army.map(({ monster }) => monster));
  if (sphinxCount === 1) types.delete("sphinx");
  return types.size;
}

function scorePerSphinx(typeCount: number): number {
  if (typeCount <= TYPE_THRESHOLD) return STANDARD_SPHINX_SCORE;
  return BASE_SPHINX_SCORE + POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - TYPE_THRESHOLD);
}

export function scoreSphinx(army: Card[]): number {
  const sphinxCount = countSphinx(army);
  const typeCount = countTypesSeenBySphinx(army, sphinxCount);
  return sphinxCount * scorePerSphinx(typeCount);
}
