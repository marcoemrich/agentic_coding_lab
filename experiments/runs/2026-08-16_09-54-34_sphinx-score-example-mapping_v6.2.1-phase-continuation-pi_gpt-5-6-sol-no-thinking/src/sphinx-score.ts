export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface Card {
  monster: Monster;
  // These literals are the three point variants defined by the card schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const FIRST_BONUS_THRESHOLD = 4;
const POINTS_PER_ADDITIONAL_TYPE = 2;
const SCORE_AT_FIRST_BONUS = 3;
const BASE_SCORE = 2;

export function scoreSphinx(army: Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  const distinctNonSphinxMonsterTypeCount = new Set(
    army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  ).size;
  const monsterCountSeenByEachSphinx =
    distinctNonSphinxMonsterTypeCount + sphinxCount - 1;
  const scorePerSphinx = monsterCountSeenByEachSphinx >= FIRST_BONUS_THRESHOLD
    ? POINTS_PER_ADDITIONAL_TYPE
      * (monsterCountSeenByEachSphinx - FIRST_BONUS_THRESHOLD)
      + SCORE_AT_FIRST_BONUS
    : BASE_SCORE;

  return sphinxCount * scorePerSphinx;
}
