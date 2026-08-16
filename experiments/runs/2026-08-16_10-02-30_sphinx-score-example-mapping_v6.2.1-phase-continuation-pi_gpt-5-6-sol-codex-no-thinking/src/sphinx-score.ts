export interface Card {
  monster: string;
  rank?: number;
}

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const BASE_SCORE_PER_SPHINX = 1;
const MINIMUM_SCORE_PER_SPHINX = 2;
const MONSTER_TYPES_BEFORE_BONUS = 3;
const BONUS_PER_ADDITIONAL_MONSTER_TYPE = 2;

export const scoreSphinxes = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinx).length;
  const distinctNonSphinxMonsterTypeCount = new Set(
    army
      .filter((armyCard) => !isSphinx(armyCard))
      .map((armyCard) => armyCard.monster),
  ).size;

  const viewedMonsterTypeCount =
    distinctNonSphinxMonsterTypeCount + (sphinxCount > 1 ? 1 : 0);
  const scorePerSphinx = viewedMonsterTypeCount > MONSTER_TYPES_BEFORE_BONUS
    ? BASE_SCORE_PER_SPHINX + BONUS_PER_ADDITIONAL_MONSTER_TYPE
      * (viewedMonsterTypeCount - MONSTER_TYPES_BEFORE_BONUS)
    : MINIMUM_SCORE_PER_SPHINX;

  return sphinxCount * scorePerSphinx;
};
