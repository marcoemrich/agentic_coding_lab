export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const POINT_FOR_THE_SPHINX_ITSELF = 1;
const MINIMUM_COMPANY_BONUS = 1;
const COMPANY_TYPE_THRESHOLD = 3;
const POINTS_PER_COMPANY_TYPE_BEYOND_THRESHOLD = 2;

/**
 * What makes two cards the same type for scoring. Rank is deliberately
 * ignored: an Undead Warrior of rank 1 and one of rank 3 are one type, not two.
 */
const typeOf = (card: Card): string => card.monster;

/**
 * The distinct monster types keeping one card company — every other card in
 * the army, the card itself excluded. A second Sphinx is company like any
 * other monster.
 */
const countCompanyTypes = (army: Card[], cardIndex: number): number =>
  new Set(army.filter((_, index) => index !== cardIndex).map(typeOf)).size;

/** What one Sphinx earns from the variety of monsters around it. */
const scoreOneSphinx = (army: Card[], cardIndex: number): number => {
  const companyTypes = countCompanyTypes(army, cardIndex);
  const typesBeyondThreshold = Math.max(companyTypes - COMPANY_TYPE_THRESHOLD, 0);
  const companyBonus = Math.max(
    POINTS_PER_COMPANY_TYPE_BEYOND_THRESHOLD * typesBeyondThreshold,
    MINIMUM_COMPANY_BONUS,
  );
  return POINT_FOR_THE_SPHINX_ITSELF + companyBonus;
};

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      card.monster === SPHINX ? total + scoreOneSphinx(army, index) : total,
    0,
  );
