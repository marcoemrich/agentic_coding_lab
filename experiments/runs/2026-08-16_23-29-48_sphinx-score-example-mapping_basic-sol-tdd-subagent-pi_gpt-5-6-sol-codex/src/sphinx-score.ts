export type Card = {
  monster: "sphinx" | "undead-warrior" | "zombie" | "hydra" | "cyclops" | "orthrus" | "chimera";
  // Rank variants are binding values from the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
};

const SPHINX_FALLBACK_SCORE = 2;
const BONUS_TYPE_THRESHOLD = 4;
const POINTS_PER_BONUS_TYPE = 2;
const PRINTED_POINT = 1;

function scorePerSphinx(effectiveMonsterTypeCount: number): number {
  if (effectiveMonsterTypeCount <= BONUS_TYPE_THRESHOLD) return SPHINX_FALLBACK_SCORE;
  return PRINTED_POINT + (effectiveMonsterTypeCount - BONUS_TYPE_THRESHOLD) * POINTS_PER_BONUS_TYPE;
}

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  const distinctMonsterTypeCount = new Set(army.map(({ monster }) => monster)).size;
  const effectiveMonsterTypeCount = distinctMonsterTypeCount + sphinxCount - 1;

  return sphinxCount * scorePerSphinx(effectiveMonsterTypeCount);
}
