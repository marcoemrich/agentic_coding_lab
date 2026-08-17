type MonsterCard = { monster: string; rank?: number };

const SPHINX_MONSTER = "sphinx";
const NO_SPHINX = 0;
const NO_OTHER_MONSTER_TYPES = 0;
const SCORE_WITH_NO_OTHER_MONSTER_TYPES = 1;
const SCORE_WITH_UP_TO_TWO_OTHER_TYPES = 2;
const SCORE_WITH_THREE_OR_FOUR_OTHER_TYPES = 3;
const SCORE_WITH_FIVE_OR_MORE_OTHER_TYPES = 5;
const MAX_OTHER_MONSTER_TYPES_WITH_TWO_POINT_BONUS = 2;
const MAX_OTHER_MONSTER_TYPES_WITH_THREE_POINT_BONUS = 4;

type ArmyPayload = {
  army: MonsterCard[];
};

export function calculateSphinxScore(armyPayload: ArmyPayload): number {
  const sphinxCount = armyPayload.army.filter((card) => card.monster === SPHINX_MONSTER).length;
  if (sphinxCount === NO_SPHINX) {
    return NO_SPHINX;
  }

  const uniqueOtherMonsterTypes = new Set(
    armyPayload.army
      .filter((card) => card.monster !== SPHINX_MONSTER)
      .map((card) => card.monster),
  );

  const distinctOtherMonsterTypeCount = uniqueOtherMonsterTypes.size;

  const baseScoreForSingleSphinx = scoreForSingleSphinx(distinctOtherMonsterTypeCount);

  return sphinxCount * baseScoreForSingleSphinx;
}

function scoreForSingleSphinx(distinctOtherMonsterTypeCount: number): number {
  if (distinctOtherMonsterTypeCount === NO_OTHER_MONSTER_TYPES) {
    return SCORE_WITH_NO_OTHER_MONSTER_TYPES;
  }
  if (distinctOtherMonsterTypeCount <= MAX_OTHER_MONSTER_TYPES_WITH_TWO_POINT_BONUS) {
    return SCORE_WITH_UP_TO_TWO_OTHER_TYPES;
  }
  if (distinctOtherMonsterTypeCount <= MAX_OTHER_MONSTER_TYPES_WITH_THREE_POINT_BONUS) {
    return SCORE_WITH_THREE_OR_FOUR_OTHER_TYPES;
  }
  return SCORE_WITH_FIVE_OR_MORE_OTHER_TYPES;
}
