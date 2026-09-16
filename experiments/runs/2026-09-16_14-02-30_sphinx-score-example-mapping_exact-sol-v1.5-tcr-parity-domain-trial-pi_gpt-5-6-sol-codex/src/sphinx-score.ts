const UNDEAD_WARRIOR_RANK_TWO = 2;
const UNDEAD_WARRIOR_RANK_THREE = 3;

export interface Card {
  monster: string;
  rank?: 1 | typeof UNDEAD_WARRIOR_RANK_TWO | typeof UNDEAD_WARRIOR_RANK_THREE;
}

const PRINTED_POINT = 1;
const FALLBACK_BONUS = 1;
const BONUS_MULTIPLIER = 2;
const THREE_TYPES = 3;

function isSphinx({ monster }: Card): boolean {
  return monster === "sphinx";
}

function scorePerSphinx(typeCount: number): number {
  const typeBonus = typeCount > THREE_TYPES
    ? BONUS_MULTIPLIER ** (typeCount - THREE_TYPES)
    : FALLBACK_BONUS;
  return PRINTED_POINT + typeBonus;
}

function countVisibleTypes(army: readonly Card[], sphinxCount: number): number {
  const otherTypes = new Set(
    army.filter((card) => !isSphinx(card)).map(({ monster }) => monster),
  );
  return otherTypes.size + (sphinxCount > 1 ? 1 : 0);
}

export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(isSphinx).length;
  return sphinxCount * scorePerSphinx(countVisibleTypes(army, sphinxCount));
}
