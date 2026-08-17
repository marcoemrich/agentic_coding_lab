export interface Card {
  monster: "sphinx" | "undead-warrior" | "zombie" | "hydra" | "cyclops" | "orthrus" | "chimera";
  // eslint-disable-next-line no-magic-numbers -- ranks are binding schema values
  rank?: 1 | 2 | 3;
}

const BASE_SPHINX_SCORE = 1;
const MINIMUM_SPHINX_SCORE = 2;
const TYPES_BEFORE_BONUS = 3;
const POINTS_PER_BONUS_TYPE = 2;

export function scoreSphinx(army: Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  const otherMonsterTypes = new Set(
    army.filter(({ monster }) => monster !== "sphinx").map(({ monster }) => monster),
  );
  const otherSphinxTypeCount = sphinxCount > 1 ? 1 : 0;
  const visibleTypeCount = otherMonsterTypes.size + otherSphinxTypeCount;
  const scorePerSphinx = visibleTypeCount > TYPES_BEFORE_BONUS
    ? BASE_SPHINX_SCORE + POINTS_PER_BONUS_TYPE * (visibleTypeCount - TYPES_BEFORE_BONUS)
    : MINIMUM_SPHINX_SCORE;
  return sphinxCount * scorePerSphinx;
}
